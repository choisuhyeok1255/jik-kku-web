import Character1 from "@/public/1.svg";

const WinningRateTabItem = () => {
  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        className="mx-auto mb-[16px] flex h-[196px] w-[361px] items-center justify-center rounded-[64px] py-[24px]"
        style={{
          background: `
          linear-gradient(0deg, rgba(30, 30, 30, 0.2), rgba(30, 30, 30, 0.2)),
          radial-gradient(466.84% 466.84% at 50% 0%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 100%)
        `,
        }}
      >
        <div className="flex flex-col justify-center">
          <span className="text-[20px] leading-[100%] text-white">
            직관 승률
          </span>
          <div className="flex items-center justify-center">
            <span
              className="text-[120px] leading-[100%] font-bold text-white"
              style={{ WebkitTextStroke: "8px rgba(255, 255, 255, 0.1)" }}
            >
              80
            </span>
            <span className="text-[40px]">%</span>
          </div>
        </div>
      </div>
      <div className="text-center text-[16px] leading-[100%] text-white">
        너무 놀라운데요! 계속 응원해봐요
      </div>
      <Character1 className="absolute bottom-[-150px] left-1/2 h-[626px] w-[626px] max-w-none -translate-x-1/2" />
    </div>
  );
};

export default WinningRateTabItem;
