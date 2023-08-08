export interface Message {
  requestId?: number;
  text: string;
  img: string;
  msgID?: string;
  msgHash?: string;
  content?: string;
  hasTag: boolean;
  progress?: string;
  index?: number;  
  oldMsgID?: string;
  oldMsgHash?: string;
  fromDB?: boolean;
  isUpscale?: boolean;
  isVarient?: boolean;
}
