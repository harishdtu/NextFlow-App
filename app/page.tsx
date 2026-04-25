export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-white gap-4">
      <h1>Welcome to NextFlow 🚀</h1>

      <a href="/dashboard">
        <button className="bg-blue-600 px-4 py-2 rounded">
          Go to Dashboard
        </button>
      </a>
    </div>
  );
}