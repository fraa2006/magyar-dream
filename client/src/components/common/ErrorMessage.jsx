export default function ErrorMessage({ message = 'Si è verificato un errore.' }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <p className="text-5xl mb-4">⚠️</p>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}
