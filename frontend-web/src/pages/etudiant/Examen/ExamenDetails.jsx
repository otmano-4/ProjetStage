import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Aside from "../../../components/Layouts/Aside";
import Header from "../../../components/Layouts/Header";

export default function ExamenDetailsEtudiant({ pages }) {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitMsg, setSubmitMsg] = useState("");
  const [soumission, setSoumission] = useState(null);
  const [reponses, setReponses] = useState([]);
  const [saveMsg, setSaveMsg] = useState("");
  const [tempsRestant, setTempsRestant] = useState(null); // en secondes
  const [tempsEcoule, setTempsEcoule] = useState(false);
  const [examenCommence, setExamenCommence] = useState(false);
  
  // Refs pour éviter les re-renders inutiles dans le useEffect du timer
  const soumissionRef = useRef(null);
  const questionsRef = useRef([]);
  const answersRef = useRef({});
  const errorCountRef = useRef(0);
  const pollingIntervalRef = useRef(null); // Ref pour stocker l'intervalle de polling
  const soumissionPollingIntervalRef = useRef(null); // Ref pour le polling de soumission

  const user = useSelector((state) => state.auth.user);
  
  // Mettre à jour les refs quand les valeurs changent
  useEffect(() => {
    soumissionRef.current = soumission;
  }, [soumission]);
  
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);
  
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/examens/${id}/details`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement");
        return res.json();
      })
      .then((data) => {
        // Vérifier d'abord si l'examen est dans la période autorisée
        let examenExpire = false;
        let examenPasCommence = false;
        
        if (data.dateDebut) {
          const dateDebut = new Date(data.dateDebut);
          if (new Date() < dateDebut) {
            setError(`L'examen n'a pas encore commencé. Date de début : ${dateDebut.toLocaleString('fr-FR')}`);
            examenPasCommence = true;
            setLoading(false);
            return;
          }
        }
        
        if (data.dateFin) {
          const dateFin = new Date(data.dateFin);
          if (new Date() > dateFin) {
            // L'examen est expiré - permettre la consultation en lecture seule
            examenExpire = true;
            setTempsEcoule(true);
            setTempsRestant(0);
          }
        }
        
        setExam(data);
        setQuestions(data.questions || []);
        setError("");
        
        // Charger la soumission existante (même si l'examen est expiré, pour voir les résultats)
        if (user?.id) {
          // Charger la soumission d'abord
          fetch(`http://localhost:8080/api/examens/${id}/soumissions/me?etudiantId=${user.id}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.soumission) {
                setSoumission(data.soumission);
                setReponses(data.reponses || []);
                const ans = {};
                (data.reponses || []).forEach((r) => {
                  ans[r.questionId] = r.reponse;
                });
                setAnswers(ans);
                if (data.soumission.tempsRestantSecondes !== null && data.soumission.tempsRestantSecondes !== undefined) {
                  setTempsRestant(data.soumission.tempsRestantSecondes);
                  setTempsEcoule(data.soumission.tempsRestantSecondes <= 0 || examenExpire);
                }
              }
            })
            .catch(() => {});
          
          // Démarrer l'examen SEULEMENT si l'examen n'est pas expiré
          if (!examenExpire) {
            fetch(`http://localhost:8080/api/examens/${id}/start?etudiantId=${user.id}`, {
              method: "POST",
            })
              .then((res) => {
                if (!res.ok) {
                  return res.text().then(text => {
                    // Si l'erreur indique que l'examen est terminé, ne pas bloquer l'accès
                    if (text.includes("terminé") || text.includes("Date de fin")) {
                      setTempsEcoule(true);
                      setTempsRestant(0);
                      setExamenCommence(false);
                      return null; // Retourner null au lieu de undefined
                    }
                    throw new Error(text || "Erreur lors du démarrage");
                  });
                }
                return res.json();
              })
              .then((data) => {
                // Vérifier que data existe avant d'accéder à ses propriétés
                if (data) {
                  setExamenCommence(true);
                  if (data.tempsEcoule) {
                    setTempsEcoule(true);
                    setTempsRestant(0);
                  }
                }
              })
              .catch((err) => {
                // Ne pas bloquer l'accès si l'erreur concerne l'expiration
                if (!err.message || (!err.message.includes("terminé") && !err.message.includes("Date de fin"))) {
                  setError(err.message || "Impossible de démarrer l'examen");
                }
                setTempsEcoule(true);
                setExamenCommence(false);
              });
          } else {
            // Si l'examen est expiré, on peut quand même afficher les résultats
            setExamenCommence(false);
          }
        }
      })
      .catch(() => setError("Impossible de charger l'examen"))
      .finally(() => setLoading(false));
  }, [id, user?.id]);

  // Recharger la soumission périodiquement pour voir les résultats publiés
  useEffect(() => {
    if (!user?.id || !id || !exam) return; // Attendre que exam soit chargé
    
    // Nettoyer l'ancien intervalle s'il existe
    if (soumissionPollingIntervalRef.current) {
      clearInterval(soumissionPollingIntervalRef.current);
      soumissionPollingIntervalRef.current = null;
    }
    
    // Arrêter complètement le polling si l'examen est expiré
    if (exam.dateFin && new Date() > new Date(exam.dateFin)) {
      return; // Ne pas démarrer le polling pour un examen expiré
    }
    
    // Vérifier si la soumission est déjà finalisée avant de démarrer le polling
    const currentSoumission = soumissionRef.current;
    if (currentSoumission && currentSoumission.statut !== "EN_COURS") {
      return; // Ne pas démarrer le polling si déjà finalisée
    }
    
    // Ne démarrer le polling que si l'examen n'est pas expiré ET que la soumission est EN_COURS
    const interval = setInterval(() => {
      // Vérifier si l'examen est expiré avant chaque requête
      if (exam?.dateFin && new Date() > new Date(exam.dateFin)) {
        clearInterval(interval);
        soumissionPollingIntervalRef.current = null;
        return;
      }
      
      // Arrêter si la soumission est finalisée (PUBLIE, CORRIGE, SOUMIS)
      const currentSoumission = soumissionRef.current;
      if (currentSoumission && currentSoumission.statut !== "EN_COURS") {
        clearInterval(interval);
        soumissionPollingIntervalRef.current = null;
        return;
      }
      
      // Ne faire la requête que si nécessaire
      fetch(`http://localhost:8080/api/examens/${id}/soumissions/me?etudiantId=${user.id}`)
        .then((res) => {
          if (!res.ok) return null;
          return res.json();
        })
        .then((data) => {
          if (!data) return;
          
          if (data.soumission) {
            const currentSoumission = soumissionRef.current;
            // Mettre à jour la soumission si elle a changé (par exemple, publiée)
            if (!currentSoumission || data.soumission.statut !== currentSoumission.statut || 
                data.soumission.id !== currentSoumission.id) {
              setSoumission(data.soumission);
              setReponses(data.reponses || []);
              const ans = {};
              (data.reponses || []).forEach((r) => {
                ans[r.questionId] = r.reponse;
              });
              setAnswers(ans);
              soumissionRef.current = data.soumission;
              
              // Arrêter le polling si la soumission est finalisée
              if (data.soumission.statut !== "EN_COURS") {
                clearInterval(interval);
                soumissionPollingIntervalRef.current = null;
              }
            }
          }
        })
        .catch(() => {
          // Ignorer les erreurs silencieusement
        });
    }, 15000); // Augmenter à 15 secondes pour réduire encore la charge

    soumissionPollingIntervalRef.current = interval;

    return () => {
      if (soumissionPollingIntervalRef.current) {
        clearInterval(soumissionPollingIntervalRef.current);
        soumissionPollingIntervalRef.current = null;
      }
    };
  }, [id, user?.id, exam?.id]); // Retirer exam?.dateFin pour éviter les re-créations

  // Vérifier périodiquement si l'examen est expiré (dateFin)
  useEffect(() => {
    if (!exam || !exam.dateFin) return;
    
    // Si déjà expiré, ne pas créer d'intervalle
    if (tempsEcoule) return;

    const checkExpiration = () => {
      const dateFin = new Date(exam.dateFin);
      const maintenant = new Date();
      
      if (maintenant > dateFin) {
        // L'examen est expiré - bloquer l'accès
        setTempsEcoule(true);
        setTempsRestant(0);
        
        // Arrêter tous les polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        if (soumissionPollingIntervalRef.current) {
          clearInterval(soumissionPollingIntervalRef.current);
          soumissionPollingIntervalRef.current = null;
        }
        
        // Si la soumission est encore EN_COURS, forcer la soumission automatique
        if (soumissionRef.current && soumissionRef.current.statut === "EN_COURS") {
          handleAutoSubmit();
        }
      }
    };

    // Vérifier immédiatement
    checkExpiration();

    // Vérifier toutes les 10 secondes (pas besoin de vérifier plus souvent)
    const interval = setInterval(checkExpiration, 10000);

    return () => clearInterval(interval);
  }, [exam?.dateFin]); // Retirer tempsEcoule des dépendances pour éviter les re-créations

  // Nettoyage au démontage du composant
  useEffect(() => {
    return () => {
      // Nettoyer tous les intervalles au démontage
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      if (soumissionPollingIntervalRef.current) {
        clearInterval(soumissionPollingIntervalRef.current);
        soumissionPollingIntervalRef.current = null;
      }
    };
  }, []);

  // Mettre à jour le temps restant toutes les secondes
  useEffect(() => {
    // Arrêter le polling si l'examen n'a pas commencé, pas d'utilisateur, temps écoulé
    if (!examenCommence || !user?.id || tempsEcoule) {
      // Nettoyer l'intervalle si nécessaire
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }
    
    // Vérifier si l'examen est expiré par dateFin
    if (exam?.dateFin && new Date() > new Date(exam.dateFin)) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }
    
    // Vérifier si la soumission est encore EN_COURS
    if (soumissionRef.current && soumissionRef.current.statut !== "EN_COURS") {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Nettoyer l'ancien intervalle s'il existe
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    const interval = setInterval(() => {
      // Vérifier à nouveau avant chaque requête
      const currentSoumission = soumissionRef.current;
      if (currentSoumission && currentSoumission.statut !== "EN_COURS") {
        clearInterval(interval);
        pollingIntervalRef.current = null;
        return;
      }
      
      // Vérifier aussi si l'examen est expiré par dateFin
      if (exam?.dateFin) {
        const dateFin = new Date(exam.dateFin);
        if (new Date() > dateFin) {
          setTempsEcoule(true);
          setTempsRestant(0);
          clearInterval(interval);
          pollingIntervalRef.current = null;
          if (currentSoumission && currentSoumission.statut === "EN_COURS") {
            handleAutoSubmit();
          }
          return;
        }
      }
      
      fetch(`http://localhost:8080/api/examens/${id}/soumissions/me/time?etudiantId=${user.id}`)
        .then((res) => {
          if (!res.ok) {
            // Si l'erreur indique que l'examen est terminé, arrêter le polling
            if (res.status === 500) {
              clearInterval(interval);
              pollingIntervalRef.current = null;
              setTempsEcoule(true);
              setTempsRestant(0);
            }
            throw new Error("Erreur réseau");
          }
          return res.json();
        })
        .then((data) => {
          // Vérifier que data existe
          if (!data) return;
          
          // Réinitialiser le compteur d'erreurs en cas de succès
          errorCountRef.current = 0;
          
          if (data.tempsRestantSecondes !== null && data.tempsRestantSecondes !== undefined) {
            setTempsRestant(data.tempsRestantSecondes);
            if (data.tempsEcoule) {
              setTempsEcoule(true);
              setTempsRestant(0);
              clearInterval(interval);
              pollingIntervalRef.current = null;
              
              // Soumettre automatiquement si le temps est écoulé et que la soumission est EN_COURS
              const currentSoumission = soumissionRef.current;
              if (currentSoumission && currentSoumission.statut === "EN_COURS") {
                handleAutoSubmit();
              }
            }
          }
        })
        .catch((err) => {
          // Arrêter le polling après 3 erreurs consécutives pour éviter les boucles infinies
          errorCountRef.current += 1;
          if (errorCountRef.current >= 3) {
            console.error("Arrêt du polling : trop d'erreurs de connexion au backend");
            clearInterval(interval);
            pollingIntervalRef.current = null;
            setError("Impossible de se connecter au serveur. Vérifiez que le backend est démarré.");
          }
        });
    }, 3000); // Augmenter à 3 secondes pour réduire encore la charge

    pollingIntervalRef.current = interval;

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [examenCommence, user?.id, id]); // Réduire les dépendances pour éviter les re-créations fréquentes

  // Fonction pour soumettre automatiquement
  const handleAutoSubmit = async () => {
    if (!user?.id) return;
    
    const payload = {
      etudiantId: user.id,
      responses: questionsRef.current.map((q) => ({
        questionId: q.id,
        reponse: answersRef.current[q.id] || "",
      })),
    };
    
    try {
      const res = await fetch(`http://localhost:8080/api/examens/${id}/soumissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        const data = await res.json();
        setSubmitMsg("Soumission automatique effectuée (temps écoulé)");
        // Recharger la soumission
        const soumRes = await fetch(`http://localhost:8080/api/examens/${id}/soumissions/me?etudiantId=${user.id}`);
        if (soumRes.ok) {
          const soumData = await soumRes.json();
          if (soumData.soumission) {
            setSoumission(soumData.soumission);
            soumissionRef.current = soumData.soumission;
          }
        }
      }
    } catch (e) {
      console.error("Erreur lors de la soumission automatique:", e);
    }
  };

  const handleChange = (questionId, value) => {
    if (soumission && soumission.statut !== "EN_COURS") return;
    if (tempsEcoule) {
      alert("Le temps est écoulé. Vous ne pouvez plus modifier vos réponses.");
      return;
    }
    // Vérifier aussi si l'examen est expiré par dateFin
    if (exam?.dateFin) {
      const dateFin = new Date(exam.dateFin);
      if (new Date() > dateFin) {
        alert("L'examen est terminé. Vous ne pouvez plus modifier vos réponses.");
        setTempsEcoule(true);
        return;
      }
    }
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSaveBrouillon = async () => {
    if (!user?.id) {
      alert("Utilisateur non connecté");
      return;
    }
    if (soumission && soumission.statut !== "EN_COURS") {
      alert("Soumission déjà finalisée");
      return;
    }
    if (tempsEcoule) {
      alert("Le temps est écoulé. Vous ne pouvez plus sauvegarder.");
      return;
    }
    // Vérifier aussi si l'examen est expiré par dateFin
    if (exam?.dateFin) {
      const dateFin = new Date(exam.dateFin);
      if (new Date() > dateFin) {
        alert("L'examen est terminé. Vous ne pouvez plus sauvegarder.");
        return;
      }
    }
    const payload = {
      etudiantId: user.id,
      responses: questions.map((q) => ({
        questionId: q.id,
        reponse: answers[q.id] || "",
      })),
    };
    try {
      const res = await fetch(`http://localhost:8080/api/examens/${id}/soumissions/brouillon`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erreur sauvegarde");
      setSaveMsg("Brouillon sauvegardé");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (e) {
      console.error(e);
      alert("Impossible de sauvegarder le brouillon");
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      alert("Utilisateur non connecté");
      return;
    }
    if (soumission && soumission.statut !== "EN_COURS") {
      alert("Soumission déjà finalisée");
      return;
    }
    if (tempsEcoule && !soumission) {
      alert("Le temps est écoulé. Vous ne pouvez plus soumettre.");
      return;
    }
    // Vérifier aussi si l'examen est expiré par dateFin
    if (exam?.dateFin) {
      const dateFin = new Date(exam.dateFin);
      if (new Date() > dateFin) {
        alert("L'examen est terminé. Vous ne pouvez plus soumettre.");
        setTempsEcoule(true);
        return;
      }
    }
    
    // Désactiver le formulaire pendant la soumission
    setSubmitMsg("Soumission en cours...");
    
    const payload = {
      etudiantId: user.id,
      responses: questions.map((q) => ({
        questionId: q.id,
        reponse: answers[q.id] || "",
      })),
    };
    try {
      const res = await fetch(`http://localhost:8080/api/examens/${id}/soumissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erreur soumission: ${errorText}`);
      }
      const data = await res.json();
      
      // Recharger la soumission complète pour avoir tous les détails
      const soumRes = await fetch(`http://localhost:8080/api/examens/${id}/soumissions/me?etudiantId=${user.id}`);
      if (soumRes.ok) {
        const soumData = await soumRes.json();
        if (soumData.soumission) {
          setSoumission(soumData.soumission);
          setReponses(soumData.reponses || []);
          // Mettre à jour la ref pour arrêter le polling
          soumissionRef.current = soumData.soumission;
        }
      }
      
      setSubmitMsg(
        `Soumission enregistrée ! Score auto : ${data.scoreAuto || 0} / ${data.totalAutoMax || 0} points`
      );
      
      // Arrêter le polling si la soumission n'est plus EN_COURS
      if (data.statut && data.statut !== "EN_COURS") {
        setTempsEcoule(true);
      }
    } catch (e) {
      console.error(e);
      setSubmitMsg("");
      alert("Impossible d'envoyer les réponses. Vérifiez votre connexion au serveur.");
    }
  };

  if (loading) return <p className="p-6">Chargement...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!exam) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Aside pages={pages} />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full space-y-6">
          <header>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{exam.titre}</h1>
                <p className="text-gray-600 mt-2">{exam.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Durée : {exam.duree} min
                </p>
                {exam?.dateFin && new Date() > new Date(exam.dateFin) && (
                  <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-orange-800 text-sm font-medium">
                      ⚠️ L'examen est terminé. Vous pouvez consulter vos réponses et résultats en lecture seule.
                    </p>
                    <p className="text-orange-700 text-xs mt-1">
                      Date de fin : {new Date(exam.dateFin).toLocaleString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
              {examenCommence && tempsRestant !== null && soumission?.statut === "EN_COURS" && !tempsEcoule && exam?.dateFin && new Date() <= new Date(exam.dateFin) && (
                <div className={`px-4 py-2 rounded-lg font-bold text-lg ${
                  tempsRestant <= 60 ? "bg-red-100 text-red-800" :
                  tempsRestant <= 300 ? "bg-yellow-100 text-yellow-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  <span>
                    {Math.floor(tempsRestant / 60)}:{(tempsRestant % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
            {soumission && soumission.statut === "PUBLIE" && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="font-semibold text-blue-900 mb-2">Résultats publiés</h2>
                <p className="text-blue-800">
                  Score automatique : {soumission.scoreAuto || 0} /{" "}
                  {questions
                    .filter((q) => q.type !== "TEXT")
                    .reduce((sum, q) => sum + (q.bareme || 0), 0)}
                </p>
                <p className="text-blue-800">
                  Score manuel : {soumission.scoreManuel || 0} /{" "}
                  {questions
                    .filter((q) => q.type === "TEXT")
                    .reduce((sum, q) => sum + (q.bareme || 0), 0)}
                </p>
                <p className="text-lg font-bold text-blue-900 mt-2">
                  Score total : {soumission.scoreTotal || 0} /{" "}
                  {questions.reduce((sum, q) => sum + (q.bareme || 0), 0)}
                </p>
              </div>
            )}
          </header>

          <section className="space-y-4">
            {questions.length === 0 ? (
              <p className="text-gray-600">Aucune question pour le moment.</p>
            ) : (
              questions.map((q, idx) => {
                const options = (q.choix || "").split(",").filter(Boolean);
                const typeLabel =
                  q.type === "TEXT"
                    ? "Question ouverte"
                    : q.type === "TRUE_FALSE"
                    ? "Vrai / Faux"
                    : "QCM / Choix multiples";
                
                const reponseData = reponses.find((r) => r.questionId === q.id);
                const isPublished = soumission && soumission.statut === "PUBLIE";
                const isCorrect = reponseData && q.type !== "TEXT" && 
                  reponseData.reponse && q.correct &&
                  reponseData.reponse.trim().toLowerCase() === q.correct.trim().toLowerCase();

                return (
                    <div
                    key={q.id || idx}
                    className={`bg-white border rounded-xl p-4 shadow-sm ${
                      isPublished && isCorrect ? "border-green-300 bg-green-50" : 
                      isPublished && !isCorrect ? "border-red-300 bg-red-50" : 
                      "border-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">
                        {idx + 1}. {q.titre} {q.bareme && `(${q.bareme} pts)`}
                      </h3>
                      <span className="text-xs text-gray-500">{typeLabel}</span>
                    </div>

                    {isPublished && reponseData && (
                      <div className="mt-2 mb-3 p-2 bg-gray-100 rounded">
                        <p className="text-sm">
                          <span className="font-medium">Ta réponse :</span> {reponseData.reponse || "Aucune"}
                        </p>
                        {reponseData.note !== null && (
                          <p className="text-sm mt-1">
                            <span className="font-medium">Note :</span> {reponseData.note} / {q.bareme || 1}
                          </p>
                        )}
                        {q.type !== "TEXT" && (
                          <p className="text-sm mt-1">
                            <span className="font-medium">Réponse correcte :</span> {q.correct}
                          </p>
                        )}
                      </div>
                    )}

                    {options.length > 0 && (
                      <ul className="mt-2 space-y-1 text-gray-700">
                        {options.map((opt, i) => {
                          const isSelected = answers[q.id] === opt;
                          const isCorrectOption = opt.trim().toLowerCase() === q.correct?.trim().toLowerCase();
                          return (
                            <li
                              key={i}
                              className={`flex items-center gap-2 text-sm px-3 py-2 rounded ${
                                isPublished && isCorrectOption ? "bg-green-100 border border-green-300" :
                                isPublished && isSelected && !isCorrectOption ? "bg-red-100 border border-red-300" :
                                "bg-gray-50"
                              } ${(soumission && soumission.statut === "EN_COURS" && !tempsEcoule) ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                              onClick={() => {
                                if (soumission && soumission.statut !== "EN_COURS") return;
                                if (tempsEcoule) {
                                  alert("Le temps est écoulé. Vous ne pouvez plus modifier vos réponses.");
                                  return;
                                }
                                handleChange(q.id, opt);
                              }}
                            >
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                checked={isSelected}
                                onChange={() => handleChange(q.id, opt)}
                                disabled={(soumission && soumission.statut !== "EN_COURS") || tempsEcoule}
                              />
                              <span className="text-gray-500">{String.fromCharCode(65 + i)}.</span>
                              <span>{opt}</span>
                              {isPublished && isCorrectOption && (
                                <span className="ml-auto text-green-600 font-semibold">✓ Correct</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {q.type === "TEXT" && (
                      <>
                        <textarea
                          className="mt-3 w-full border rounded px-3 py-2 text-sm"
                          placeholder="Ta réponse..."
                          value={answers[q.id] || ""}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          disabled={(soumission && soumission.statut !== "EN_COURS") || tempsEcoule}
                        />
                        {isPublished && reponseData && reponseData.note !== null && (
                          <p className="mt-2 text-sm text-gray-600">
                            Note attribuée : {reponseData.note} / {q.bareme || 1}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </section>

          {(!soumission || soumission.statut === "EN_COURS") && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveBrouillon}
                disabled={tempsEcoule}
                className={`px-4 py-2 rounded text-white transition ${
                  tempsEcoule ? "bg-gray-400 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600"
                }`}
              >
                Sauvegarder le brouillon
              </button>
              <button
                onClick={handleSubmit}
                disabled={tempsEcoule && !soumission}
                className={`px-4 py-2 rounded text-white transition ${
                  tempsEcoule && !soumission ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {tempsEcoule ? "Temps écoulé" : "Soumettre mes réponses"}
              </button>
              {saveMsg && <span className="text-sm text-gray-600">{saveMsg}</span>}
              {submitMsg && <span className="text-sm text-green-700">{submitMsg}</span>}
              {tempsEcoule && (
                <span className="text-sm text-red-600 font-semibold">
                  ⚠️ Le temps est écoulé. Vos réponses seront soumises automatiquement.
                </span>
              )}
            </div>
          )}
          {soumission && soumission.statut !== "EN_COURS" && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Statut : {soumission.statut === "SOUMIS" ? "Soumis" : 
                          soumission.statut === "CORRIGE" ? "Corrigé" : 
                          soumission.statut === "PUBLIE" ? "Résultats publiés" : ""}
              </span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

