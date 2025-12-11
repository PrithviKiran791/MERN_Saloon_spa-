export default function InfoMessage({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center p-8 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-blue-800 text-center">{message}</p>
    </div>
  );
}
