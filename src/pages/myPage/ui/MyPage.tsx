"use client";

import {
  useGetCertifyGameLogs,
  useGetUser,
  useUpdateNickname,
} from "@/src/entities";
import { useState } from "react";

const MyPage = () => {
  const { data: user } = useGetUser();
  const { data: certifyGameLogs } = useGetCertifyGameLogs({
    query: { userId: user?.id || "" },
  });
  const { mutate: updateNickname } = useUpdateNickname();

  const [nickname, setNickname] = useState("");
  const [isChangeNickname, setIsChangeNickname] = useState(false);

  const handleToggleUpdateNicknameButton = () => {
    setIsChangeNickname((prev) => !prev);
  };

  const handleChangeNickname = (value: string) => {
    setNickname(value);
  };

  const handleUpdateNickname = () => {
    updateNickname(
      { body: { nickname } },
      {
        onSuccess: () => {
          handleToggleUpdateNicknameButton();
          handleChangeNickname("");
          alert("닉네임 수정에 성공했습니다.");
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div>닉네임: {user?.nickname}</div>
        <button onClick={handleToggleUpdateNicknameButton}>수정</button>
        {isChangeNickname && (
          <div className="flex items-center gap-2">
            <input
              value={nickname}
              onChange={(e) => {
                handleChangeNickname(e.target.value);
              }}
              style={{ border: "1px solid white" }}
            />
            <button type="button" onClick={handleUpdateNickname}>
              저장
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div>지금까지 직관을 총 {certifyGameLogs?.length}번 했습니다.</div>
        <div>지금까지 직관 승률은 % 입니다.</div>
        <div>지금까지 사용한 비용은 원입니다.</div>
        <div>경기당 득점 점수는 점 입니다.</div>
        <div>경기당 실점 점수는 점 입니다.</div>
        <div>지금까지 최다 방문 구장은 입니다.</div>
        <div></div>
      </div>
    </div>
  );
};

export default MyPage;
