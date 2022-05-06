import { useState, useEffect, Dispatch, SetStateAction } from "react";

export type Recorder = {
  recordingMinutes: number;
  recordingSeconds: number;
  initRecording: boolean;
  mediaStream: MediaStream | null;
  mediaRecorder: MediaRecorder | null;
  audio: string | null;
  blob: Blob | null;
};

export type UseRecorder = {
  recorderState: Recorder;
  startRecording: () => void;
  cancelRecording: () => void;
  saveRecording: () => void;
};

export type RecorderControlsProps = {
  recorderState: Recorder;
  handlers: {
    startRecording: () => void;
    cancelRecording: () => void;
    saveRecording: () => void;
  };
};

export type RecordingsListProps = {
  audio: string | null;
};

export type Audio = {
  key: string;
  audio: string;
};

export type Interval = null | number | ReturnType<typeof setInterval>;
export type SetRecorder = Dispatch<SetStateAction<Recorder>>;
export type SetRecordings = Dispatch<SetStateAction<Audio[]>>;
export type AudioTrack = MediaStreamTrack;
export type MediaRecorderEvent = {
  data: Blob;
};

const initialState: Recorder = {
  recordingMinutes: 0,
  recordingSeconds: 0,
  initRecording: false,
  mediaStream: null,
  mediaRecorder: null,
  audio: null,
  blob: null,
};

export default function useRecorder() {
  const [recorderState, setRecorderState] = useState<Recorder>(initialState);

  useEffect(() => {
    const MAX_RECORDER_TIME = 1;
    let recordingInterval: Interval = null;

    if (recorderState.initRecording)
      recordingInterval = setInterval(() => {
        setRecorderState((prevState: Recorder) => {
          if (
            prevState.recordingMinutes === MAX_RECORDER_TIME &&
            prevState.recordingSeconds === 0
          ) {
            typeof recordingInterval === "number" && clearInterval(recordingInterval);
            return prevState;
          }

          if (prevState.recordingSeconds >= 0 && prevState.recordingSeconds < 59)
            return {
              ...prevState,
              recordingSeconds: prevState.recordingSeconds + 1,
            };
          else if (prevState.recordingSeconds === 59)
            return {
              ...prevState,
              recordingMinutes: prevState.recordingMinutes + 1,
              recordingSeconds: 0,
            };
          else return prevState;
        });
      }, 1000);
    else typeof recordingInterval === "number" && clearInterval(recordingInterval);

    return () => {
      typeof recordingInterval === "number" && clearInterval(recordingInterval);
    };
  });

  useEffect(() => {
    setRecorderState((prevState) => {
      if (prevState.mediaStream)
        return {
          ...prevState,
          mediaRecorder: new MediaRecorder(prevState.mediaStream),
        };
      else return prevState;
    });
  }, [recorderState.mediaStream]);

  useEffect(() => {
    const recorder = recorderState.mediaRecorder;
    let chunks: Blob[] = [];

    if (recorder && recorder.state === "inactive") {
      recorder.start();

      recorder.ondataavailable = (e: MediaRecorderEvent) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        chunks = [];

        setRecorderState((prevState: Recorder) => {
          if (prevState.mediaRecorder)
            return {
              ...initialState,
              blob: blob,
              audio: window.URL.createObjectURL(blob),
            };
          else return initialState;
        });
      };
    }

    return () => {
      if (recorder) recorder.stream.getAudioTracks().forEach((track: AudioTrack) => track.stop());
    };
  }, [recorderState.mediaRecorder]);

  return {
    recorderState,
    startRecording: () => startRecording(setRecorderState),
    cancelRecording: () => setRecorderState(initialState),
    saveRecording: () => saveRecording(recorderState.mediaRecorder),
  };
}

async function startRecording(setRecorderState: SetRecorder) {
  try {
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    setRecorderState((prevState: Recorder) => {
      return {
        ...prevState,
        initRecording: true,
        mediaStream: stream,
      };
    });
  } catch (err) {
    console.log(err);
  }
}

function saveRecording(recorder: any) {
  if (recorder.state !== "inactive") {
    recorder.stop()
  };
}