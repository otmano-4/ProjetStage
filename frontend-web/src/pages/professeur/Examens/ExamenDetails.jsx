import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { X, PlusCircle, Trash2 } from "lucide-react";
import Aside from "../../../components/Layouts/Aside";
import Header from "../../../components/Layouts/Header";

export default function ExamenDetails({ pages }) {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [questionForm, setQuestionForm] = useState({
    type: "CHOICE",
    contenu: "",
    options: [],
    reponseCorrecte: "",
  });

  // TODO: Replace this with actual API call
    useEffect(() => {
        fetch(`http://localhost:8080/api/examens/${id}`)
            .then(res => res.json())
            .then(data => {
            setExam(data);
            setQuestions(data.questions || []);
        });
    }, [id]);


  const handleAddQuestion = () => {
    if (!questionForm.contenu) return;
    setQuestions([...questions, { ...questionForm }]);
    setQuestionForm({ type: "CHOICE", contenu: "", options: [], reponseCorrecte: "" });
  };

  const handleDelete = (index) => {
    const newList = [...questions];
    newList.splice(index, 1);
    setQuestions(newList);
  };

  if (!exam) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Aside pages={pages} />
      <div className="flex flex-col flex-1 w-full min-h-screen">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{exam.titre}</h1>

          <div className="border-t mt-4 pt-4">
            <h3 className="text-lg font-semibold mb-2">Questions</h3>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Question Content"
                value={questionForm.contenu}
                onChange={(e) =>
                  setQuestionForm({ ...questionForm, contenu: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Options (comma separated)"
                value={questionForm.options.join(",")}
                onChange={(e) =>
                  setQuestionForm({ ...questionForm, options: e.target.value.split(",") })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Correct Answer"
                value={questionForm.reponseCorrecte}
                onChange={(e) =>
                  setQuestionForm({ ...questionForm, reponseCorrecte: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded"
              >
                <PlusCircle className="w-4 h-4" /> Add Question
              </button>
            </div>

            {questions.length > 0 && (
              <ul className="mt-4 space-y-2">
                {questions.map((q, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 border rounded"
                  >
                    <div>
                      <p className="font-medium">{q.contenu}</p>
                      <p className="text-sm text-gray-500">
                        Options: {q.options.join(", ")} | Correct: {q.reponseCorrecte}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:underline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
