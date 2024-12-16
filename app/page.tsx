export default function Home() {
  return (
    <main className="bg-gray-300 h-screen flex items-center justify-center p-5">
      <div className="bg-white shadow-lg p-5 rounded-2xl w-full max-w-screen-sm flex flex-col gap-2">
        <input
          className="w-full rounded-full py-3 bg-gray-200 pl-5 outline-none ring focus:ring-offset-2 transition-shadow "
          type="text"
          placeholder="Search here..."
        />

        <button className="bg-black text-white py-2 rounded-full outline-none active:scale-90 transition-transform font-medium outline-none">
          Search 
        </button>
      </div>
    </main>
  );
}
