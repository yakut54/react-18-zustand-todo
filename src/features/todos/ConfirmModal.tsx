import { useConfirm } from './useConfirm'

export const ConfirmModal = () => {
  const { isOpen, message, onConfirm, closeConfirm } = useConfirm()

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    closeConfirm()
  }

  return (
    <div className="modal-overlay" onClick={closeConfirm}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Подтверждение</h2>
        <p className="confirm-message">{message}</p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={closeConfirm}>Отмена</button>
          <button className="modal-danger" onClick={handleConfirm}>Удалить</button>
        </div>
      </div>
    </div>
  )
}
