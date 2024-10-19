export default function NavbarDashboard() {

    const navigation = [
        { name: 'Home', href: '/', emoji: "🏠" },
        { name: 'Escrever artigo', href: '/escrever-artigo', emoji: '📝' },
        { name: 'Ver denúncias', href: '/ver-denuncias', emoji: '🔍' }
    ];

    return (
        <nav className="flex-1 px-4 py-8">
        <ul>
          {navigation.map((item) => (
            <li className="mb-4">
            <a href={item.href} className="flex items-center p-2 rounded-md hover:bg-gray-700">
              <span>{item.emoji}</span>
              <span className="ml-2">{item.name}</span>
            </a>
          </li>              
          ))}
        </ul>
      </nav>
    );
}