import React, { FC, useState } from "react";
import Display from "../components/display";
import { create } from "../domain/webrtc/signaling";
import { moveMouse, clickMouse, keyTap } from "../server/robot";
import ShowIP from "../components/showip";
import ScreenList from "../components/screenlist";
import { Grow } from "@material-ui/core";
import Reload from "../components/reload";
import { getScreen } from "../domain/screen/screen";
import styled from "styled-components";

const Cast: FC = () => {
  const [screenStream, setscreenStream] = useState<MediaStream>();

  const onSelectScreen = async (id: string) => {
    const res = await getScreen(id);
    setscreenStream(res);
    onStream(res);
  };

  return (
    <div style={{}}>
      <div>
        {!screenStream && (
          <div>
            <p>シェアするスクリーンを選択してください</p>
            <ScreenList onClick={onSelectScreen} />
          </div>
        )}
        {screenStream && <Reload>{"再選択"}</Reload>}
        {screenStream && (
          <Base in={true} timeout={1000}>
            <div>
              <div style={{ width: "70vw" }}>
                <p>ipアドレスを入力してください</p>
                <ShowIP />
                <Display strem={screenStream} />
              </div>
            </div>
          </Base>
        )}
      </div>
    </div>
  );
};

export default Cast;

const onStream = async (stream: MediaStream) => {
  console.log("stream");
  const peer = await create("room", stream);

  peer.onData.subscribe((msg: any) => {
    console.log(msg);
    const data = JSON.parse(msg.data);
    switch (data.type) {
      case "move":
        moveMouse.execute(data.payload);
        break;
      case "click":
        clickMouse.execute();
        break;
      case "key":
        keyTap.execute(data.payload);
        break;
    }
  });
};

const Base = styled(Grow)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
