import React from 'react'
import { useDispatch } from 'react-redux';
import { deleteUtilisateur, fetchUtilisateurs } from '../../../store/slices/usersSlice';

function DeleteUser({deleteUserId, setShowDeleteModal, setDeleteUserId}) {
    const dispatch = useDispatch()

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirmer la suppression</h2>
        <p className="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-3">
            <button
            onClick={() => {
                setShowDeleteModal(false);
                setDeleteUserId(null);
            }}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
            Annuler
            </button>
            <button
            onClick={async () => {
                await dispatch(deleteUtilisateur(deleteUserId));
                dispatch(fetchUtilisateurs());
                setShowDeleteModal(false);
                setDeleteUserId(null);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
            Supprimer
            </button>
        </div>
        </div>
    </div>
  )
}

export default DeleteUser