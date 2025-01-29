function Footer() {
  return (
    <div className="bg-secondary md:ml-20 h-fit">
      <div className="flex flex-wrap w-[100%] justify-start text-white">
        <div className="w-[18%] m-0 flex justify-start align-middle h-fit text-xl p-4"><p>
          <a href="https://es.linkedin.com" target="_blank" rel="noopener noreferrer" className="underline">Carlos Melendo</a><br/>
          <a href="https://es.linkedin.com" target="_blank" rel="noopener noreferrer" className="underline">Jorge González</a><br/>
          <a href="https://es.linkedin.com" target="_blank" rel="noopener noreferrer" className="underline">Mario Munilla</a><br/>
          <a href="https://es.linkedin.com" target="_blank" rel="noopener noreferrer" className="underline">Santiago Alejandre</a></p>
        </div>
        <div className="w-[31%] m-0 flex justify-around align-middle h-fit pb-12 min-w-[16rem]">
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            <div className="espacio3d">
              <div className="cubo3d flex flex-col justify-end">
                <div className="base"></div>
                <aside className="cara cara1  bg-gray-800"></aside>
                <aside className="cara cara2 bg-gray-800"><img src="/app/assets/X.png" alt="X" /></aside>
              </div>
            </div>
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
            <div className="espacio3d">
              <div className="cubo3d flex flex-col justify-end">
                <div className="base"></div>
                <aside className="cara cara1  bg-fuchsia-600"></aside>
                <aside className="cara cara2 bg-fuchsia-600"><img src="/app/assets/instagram.png" alt="instagram" /></aside>
              </div>
            </div>
          </a>
          <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer">
            <div className="espacio3d">
              <div className="cubo3d flex flex-col justify-end">
                <div className="base"></div>
                <aside className="cara cara1  bg-gray-800"></aside>
                <aside className="cara cara2 bg-gray-800"><img src="/app/assets/tiktok.png" alt="tiktok" /></aside>
              </div>
            </div>
          </a>
          <a href="https://whatsapp.com/" target="_blank" rel="noopener noreferrer">
            <div className="espacio3d">
              <div className="cubo3d flex flex-col justify-end">
                <div className="base"></div>
                <aside className="cara cara1  bg-green-500"></aside>
                <aside className="cara cara2 bg-green-500"><img src="/app/assets/whatsapp.png" alt="whatsapp" /></aside>
              </div>
            </div>
          </a>
          <a href="tel:+34123456789" target="_blank" rel="noopener noreferrer">
            <div className="espacio3d">
              <div className="cubo3d flex flex-col justify-end">
                <div className="base"></div>
                <aside className="cara cara1  bg-blue-500"></aside>
                <aside className="cara cara2 bg-blue-500"><img src="/app/assets/telefono.png" alt="+34 123 456 789" /></aside>
              </div>
            </div>
          </a>
        </div>
        <div className="w-[28%] m-0 flex justify-center align-middle h-fit p-4 flex-wrap"><p className="w-[100%] mb-4">Contáctanos en: beathub2024@gmail.com</p><p className="w-[100%]">Términos de <a href="https://google.com" target="_blank" rel="noopener noreferrer"  className="underline">privacidad</a> y <a href="google.com" target="_blank" rel="noopener noreferrer"  className="underline">seguridad</a></p></div>
        <div className="min-w-32 m-0 flex align-middle h-fit p-4 w-[23%]">
        <img src="/app/assets/onlyLogoWithBorder.png" alt="logo" className="h-32 w-32"/>
        </div>
        <p className="w-[100%] text-center">© 2025 Beathub. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}

export default Footer;
