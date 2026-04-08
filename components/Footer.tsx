export default function Footer() {
  return (
    <footer className="mt-18 bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
        
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold">POSY</h2>
          <p className="text-sm text-gray-500 mt-2">
            Delicious food delivered to your door.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-2">Menu</h3>
          <ul className="space-y-1 text-sm text-gray-500">
            <li className="hover:text-black cursor-pointer">Home</li>
            <li className="hover:text-black cursor-pointer">Products</li>
            <li className="hover:text-black cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-sm text-gray-500">Email: support@foodapp.com</p>
          <p className="text-sm text-gray-500">Phone: +84 xxx xxx xxx</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="text-center text-xs text-gray-400 pb-4">
        © 2026 Food App. All rights reserved.
      </div>
    </footer>
  );
}