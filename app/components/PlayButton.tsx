type PlayButtonProps = {
    onPlay: () => void;
    estado: boolean;
  };
  
  function PlayButton({ onPlay, estado }: PlayButtonProps) {
    return (
      <div className="flex items-center justify-center h-12 w-12">
        <button
          onClick={onPlay}
          className="flex items-center justify-center h-10 w-10 bg-blue-500 rounded-full focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 fill-white"
            viewBox="0 0 16 16"
          >
            {estado ? (
              <>
                <rect x="5" y="4" width="2.5" height="8" rx="1"></rect>
                <rect x="8.5" y="4" width="2.5" height="8" rx="1"></rect>
              </>
            ) : (
              <g transform="translate(1.5, 0.5)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  shapeRendering="geometricPrecision"
                  textRendering="geometricPrecision"
                  imageRendering="optimizeQuality"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  viewBox="0 0 300 300"
                >
                  <path
                    fillRule="nonzero"
                    d="M200.08 157.84c13.75-8.88 13.7-18.77 0-26.63l-110.27-76.77c-11.19-7.04-22.89-2.9-22.58 11.72l.44 154.47c.96 15.86 10.02 20.21 23.37 12.87l109.04-75.66z"
                  />
                </svg>
              </g>
            )}
          </svg>
        </button>
      </div>
    );
  }
  
  export default PlayButton;
  