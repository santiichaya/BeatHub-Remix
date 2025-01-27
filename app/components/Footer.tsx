function Footer() {
  return ( //X instagram tiktom whatsapp
    <div className="bg-secondary md:ml-20 h-fit">
      <div className="flex flex-wrap w-[100%] justify-center">
        <div className="w-[40%] m-0 flex justify-center align-middle h-fit p-12 pt-0">
          <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            <div className="espacio3d">
              <div className="cubo3d flex flex-col justify-end">
                <div className="base"></div>
                <aside className="cara cara1  bg-black"></aside>
                <aside className="cara cara2 bg-black"><img src="/app/assets/X.png" alt="X" /></aside>
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
                <aside className="cara cara1  bg-black"></aside>
                <aside className="cara cara2 bg-black"><img src="/app/assets/tiktok.png" alt="tiktok" /></aside>
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
        </div>
        <div className="w-[20%] bg-blue-600 m-0 flex justify-center align-middle h-fit">quinto</div>
        <div className="w-[20%] bg-red-600 m-0 flex justify-center align-middle h-fit">quinto</div>
        <div className="w-[20%] bg-yellow-600 m-0 flex justify-center align-middle h-fit">quinto</div>
        <p>© 2025 Beathub. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}

export default Footer;
