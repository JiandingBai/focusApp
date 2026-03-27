import imgFrame2 from "../assets/bc1f3b0f6a54eb1a8e1f1398fb79cd46335ef064.png";
import imgToDoList from "../assets/4beb4e972137c77822d3cb42c125e018da011440.png";
import imgNote from "../assets/675057c919069d0277935e8b20e453a88704dbea.png";
import imgUsers from "../assets/708b15f10badba3aefba568a4a07300150dc191b.png";
import imgWallpaper from "../assets/6088119e12677495548467e7124fad345a3c91a0.png";
import imgVoice from "../assets/10f56b2d0746f31bd3d2abfae6193927d6f1ed97.png";
import imgMusicalNote from "../assets/a270e67b8ff8e175062c35ebb1afe8fa17608ac6.png";
import imgDeliveryTime from "../assets/fe58daf4fa71ecc588795b90f4e1cbcb20415353.png";

function TasksButton() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Tasks Button">
      <div className="absolute bg-[#4a4848] h-[41px] left-0 rounded-[5px] top-0 w-[38px]" />
      <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[9px] leading-[normal] left-[18.5px] not-italic text-[8px] text-center text-white top-[26px] w-[27px]">Tasks</p>
      <div className="absolute left-[9px] size-[20px] top-[6px]" data-name="To Do List">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgToDoList} />
      </div>
    </div>
  );
}

function NotesButton() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Notes Button">
      <div className="absolute bg-[#4a4848] h-[41px] left-0 rounded-[5px] top-0 w-[38px]" />
      <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[18.5px] not-italic text-[8px] text-center text-white top-[25px] w-[27px]">Notes</p>
      <div className="absolute h-[23px] left-[8px] top-[5px] w-[22px]" data-name="Note">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgNote} />
      </div>
    </div>
  );
}

function FriendsButton() {
  return (
    <div className="absolute contents left-0 top-0" data-name="Friends Button">
      <div className="absolute bg-[#4a4848] h-[41px] left-0 rounded-[5px] top-0 w-[38px]" />
      <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[18.5px] not-italic text-[8px] text-center text-white top-[25px] w-[27px]">Friends</p>
      <div className="absolute left-[8px] size-[22px] top-[5px]" data-name="Users">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgUsers} />
      </div>
    </div>
  );
}

function SessionsButton() {
  return (
    <div className="absolute contents left-[14px] top-[56px]" data-name="Sessions Button">
      <div className="absolute bg-[#4a4848] h-[41px] left-[14px] rounded-[5px] top-[56px] w-[38px]" />
      <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[33.5px] not-italic text-[#d16d6a] text-[8px] text-center top-[81px] w-[27px]">Session</p>
      <div className="absolute left-[23px] size-[20px] top-[63px]" data-name="Delivery Time">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgDeliveryTime} />
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[107.88%] left-[-11.42%] max-w-none top-[-7.95%] w-[122.86%]" src={imgFrame2} />
      </div>
      <div className="absolute bg-[#999797] h-[33px] left-[8px] rounded-[5px] top-[8px] w-[124px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[16px] leading-[normal] left-[37px] not-italic text-[12px] text-black top-[17px] w-[108px]">Title/Name</p>
      <div className="absolute bg-[#999797] h-[33px] left-[695px] rounded-[5px] top-[8px] w-[124px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[16px] leading-[normal] left-[724px] not-italic text-[12px] text-black top-[17px] w-[108px]">Title/Name</p>
      <div className="absolute bg-[rgba(161,161,161,0.5)] border border-[#4a4848] border-solid h-[194px] left-[8px] rounded-[5px] top-[49px] w-[50px]" />
      <div className="absolute h-[41px] left-[14px] top-[55px] w-[38px]" data-name="Session Button" />
      <button className="absolute block cursor-pointer h-[41px] left-[14px] top-[103px] w-[38px]" data-name="Tasks Button">
        <TasksButton />
      </button>
      <button className="absolute block cursor-pointer h-[41px] left-[14px] top-[150px] w-[38px]" data-name="Notes Button">
        <NotesButton />
      </button>
      <button className="absolute block cursor-pointer h-[41px] left-[14px] top-[197px] w-[38px]" data-name="Friends Button">
        <FriendsButton />
      </button>
      <div className="absolute bg-[rgba(161,161,161,0.5)] border border-[#4a4848] border-solid h-[149px] left-[8px] rounded-[5px] top-[251px] w-[50px]" />
      <button className="absolute block cursor-pointer h-[41px] left-[14px] top-[259px] w-[38px]" data-name="Spaces">
        <div className="absolute bg-[#4a4848] inset-0 rounded-[5px]" />
        <p className="absolute font-['Lato:Bold',sans-serif] inset-[60.98%_15.79%_14.63%_13.16%] leading-[normal] not-italic text-[8px] text-center text-white">Spaces</p>
        <div className="absolute inset-[0_21.05%_17.07%_21.05%]" data-name="Wallpaper">
          <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgWallpaper} />
        </div>
      </button>
      <button className="absolute block cursor-pointer h-[41px] left-[14px] top-[306px] w-[38px]" data-name="Sounds Button">
        <div className="absolute bg-[#4a4848] inset-0 rounded-[5px]" />
        <div className="absolute inset-[14.63%_13.16%_29.27%_26.32%]" data-name="Voice">
          <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgVoice} />
        </div>
        <p className="absolute font-['Lato:Bold',sans-serif] inset-[60.98%_15.79%_14.63%_13.16%] leading-[normal] not-italic text-[8px] text-center text-white">Sounds</p>
      </button>
      <button className="absolute block cursor-pointer h-[41px] left-[14px] top-[353px] w-[38px]" data-name="Music Button">
        <div className="absolute bg-[#4a4848] inset-0 rounded-[5px]" />
        <p className="absolute font-['Lato:Bold',sans-serif] inset-[60.98%_15.79%_14.63%_13.16%] leading-[normal] not-italic text-[8px] text-center text-white">Music</p>
        <div className="absolute inset-[17.07%_23.68%_34.15%_23.68%]" data-name="Musical Note">
          <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgMusicalNote} />
        </div>
      </button>
      <SessionsButton />
      <div className="absolute h-[168px] left-[289px] top-[185px] w-[253px]">
        <div className="absolute bg-[rgba(161,161,161,0.5)] border border-[#4a4848] border-solid h-[168px] left-0 rounded-[5px] top-0 w-[253px]" />
        <div className="absolute bg-[#f3f3f3] border border-[#d16d6a] border-solid inset-[14.88%_37.15%_76.19%_37.15%] rounded-[2px]" />
        <div className="absolute bg-[#d16d6a] inset-[14.88%_66.01%_76.19%_8.3%] rounded-[2px]" />
        <button className="absolute bg-[#eebfbe] block border border-[#d16d6a] border-solid cursor-pointer inset-[76.19%_21.34%_7.14%_21.34%] rounded-[5px]" />
        <div className="absolute bg-[#f3f3f3] border border-[#d16d6a] border-solid inset-[14.88%_8.3%_76.19%_66.01%] rounded-[2px]" />
        <div className="absolute flex inset-[9.52%_0_90.48%_0] items-center justify-center">
          <div className="flex-none h-px rotate-180 w-[253px]">
            <div className="relative size-full">
              <div className="absolute inset-[-1px_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 253 1">
                  <line id="Line 1" stroke="var(--stroke-0, #BABABA)" x2="253" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[127px] not-italic text-[8px] text-black text-center top-[28px] w-[58px]">Short Break</p>
        <p className="absolute font-['Lato:Bold',sans-serif] inset-[25.6%_12.25%_36.31%_12.25%] leading-[normal] not-italic text-[64px] text-black text-center">20:00</p>
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[127px] not-italic text-[15px] text-black text-center top-[132px] w-[102px]">Start Session</p>
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[54px] not-italic text-[8px] text-black text-center top-[28px] w-[58px]">Pomodoro</p>
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[200px] not-italic text-[8px] text-black text-center top-[28px] w-[58px]">Long Break</p>
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[127px] not-italic text-[8px] text-black text-center top-[28px] w-[58px]">Short Break</p>
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[127px] not-italic text-[15px] text-black text-center top-[132px] w-[102px]">Start Session</p>
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[54px] not-italic text-[8px] text-black text-center top-[28px] w-[58px]">Pomodoro</p>
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[200px] not-italic text-[8px] text-black text-center top-[28px] w-[58px]">Long Break</p>
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[127px] not-italic text-[8px] text-black text-center top-[28px] w-[58px]">Short Break</p>
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[54px] not-italic text-[8px] text-black text-center top-[28px] w-[58px]">Pomodoro</p>
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[200px] not-italic text-[8px] text-black text-center top-[28px] w-[58px]">Long Break</p>
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[127px] not-italic text-[8px] text-black text-center top-[28px] w-[58px]">Short Break</p>
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[54px] not-italic text-[8px] text-black text-center top-[28px] w-[58px]">Pomodoro</p>
        <p className="-translate-x-1/2 absolute font-['Lato:Bold',sans-serif] h-[10px] leading-[normal] left-[200px] not-italic text-[8px] text-black text-center top-[28px] w-[58px]">Long Break</p>
      </div>
    </div>
  );
}