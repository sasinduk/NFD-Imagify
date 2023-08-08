import React, { useEffect, useRef, useState } from "react";
import { Input, Button, List, Image, Typography, Progress } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { Imagine, Upscale, Variation } from "../request";
import { MJMessage } from "midjourney";
import { Message } from "../interfaces/message";
import { Images } from "../interfaces/images";
import Tag from "../components/tag";
import FloatingSettings from "./floatingSettings";

const { TextArea } = Input;
const { Text } = Typography;

const Index: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputDisable, setInputDisable] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [convertedData, setConvertedData] = useState<Message[]>([]);
  const [selectedValueCategory, setSelectedValueCategory] = useState<string | null>(null);
  const [selectedValueGrading, setSelectedValueGrading] = useState<string | null>(null);
  const [selectedValueType, setSelectedValueType] = useState<string | null>(null);
  const [selectedValueRealism, setSelectedValueRealism] = useState<string | null>(null);
  const [selectedValueBackground, setSelectedValueBackground] = useState<string | null>(null);
  const [selectedValueAspectRatio, setSelectedValueAspectRatio] = useState<string | null>(null);
  const [CheckedValueVersion, setCheckedValueVersion] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const containerRef = useRef(null);
  const itemsPerPage = 2;

  useEffect(() => {
    const scrollbarWidth = containerRef.current.offsetWidth - containerRef.current.clientWidth + 70;
    setScrollbarWidth(scrollbarWidth);
  }, []);

  const fetchDataFromDatabase = async (User) => {
    const API_URL = 'https://prod-163.westus.logic.azure.com:443/workflows/7a7c6652fc634609ba16e8ca9bcf4f1d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=oi8Dad8PjcumW14tipmR_7eOKs3426eXsHgO-Vfi78Y'; // Replace with your actual database API endpoint

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: {
            User: User,
          },
         }),
      });      

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const User = localStorage.getItem('user');
    Promise.all([
      fetchDataFromDatabase(User),
      fetchDataFromDatabase(User),
    ])
      .then(([data1, data2]) => {
        const formattedData1 = data1.map((item) => ({
          requestId: undefined,
          text: item['cr056_name'] || '',
          img: item['cr056_imageurl'] || '',
          msgID: item['cr056_messageid'] || '',
          msgHash: item['cr056_messagehash'] || '',
          content: item['cr056_content'] || '',
          hasTag: undefined,
          progress: item['cr056_timestamp'] || '',
          index: undefined,
          fromDB: true,
          isUpscale: item['cr056_upscalebit'] || false,
          isVarient: item['cr056_variantbit'] || false
        }));
        const formattedData2 = data2.map((item) => ({
          requestId: undefined,
          text: item['cr056_name'] || '',
          img: item['cr056_imageurl'] || '',
          msgID: item['cr056_messageid'] || '',
          msgHash: item['cr056_messagehash'] || '',
          content: item['cr056_content'] || '',
          hasTag: undefined,
          progress: item['cr056_timestamp'] || '',
          index: undefined,
          fromDB: true,
          isUpscale: item['cr056_upscalebit'] || false,
          isVarient: item['cr056_variantbit'] || false
        }));
        const mergedData = [...formattedData1, ...formattedData2]; 
        mergedData.sort((a, b) => a.progress - b.progress);
        setConvertedData((prevConvertedData) => [...prevConvertedData, ...mergedData]);
        const combinedData = [...mergedData.slice(0, itemsPerPage)];
        combinedData.sort((a, b) => new Date(a.progress) - new Date(b.progress));
        setMessages(combinedData);
      })
      .catch((error) => {
        console.error('Error loading more data:', error);
      });
  }, []);

  const loadMoreData = () => {
    setTimeout(() => {
      setMessages((prevMessages) => {
        const startIndex = prevMessages.length;        
        const endIndex = startIndex + itemsPerPage;   
        return [...convertedData.slice(startIndex, endIndex), ...prevMessages].sort((b, a) => new Date(b.progress) - new Date(a.progress));
      });
    }, 1000);
    
  };

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const handleScroll = () => {        
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        if (scrollTop === 0 && scrollTop !== scrollHeight - clientHeight) {
          setIsLoading(true);
          const prevScrollTop = container.scrollTop;
          const prevContainerHeight = container.scrollHeight;
          loadMoreData(); 
          setTimeout(() => {            
            const newContainerHeight = container.scrollHeight;
            const addedContentHeight = newContainerHeight - prevContainerHeight;
            const newScrollTop = prevScrollTop + addedContentHeight;
            container.scrollTop = newScrollTop;
            const newScrollTopAdjusted = newScrollTop + addedContentHeight;
            container.scrollTop = newScrollTopAdjusted;
            setIsLoading(false);
          }, 0);
        }        
      };
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [messages]);

  const handleSelectedValueCategoryChange = (value: string) => {
    setSelectedValueCategory(value);
  };

  const handleSelectedValueGradingChange = (value: string) => {
    setSelectedValueGrading(value);
  };

  const handleSelectedValueTypeChange = (value: string) => {
    setSelectedValueType(value);
  };

  const handleSelectedValueRealismChange = (value: string) => {
    setSelectedValueRealism(value);
  };

  const handleSelectedValueBackgroundChange = (value: string) => {
    setSelectedValueBackground(value);
  };

  const handleSelectedValueAspectRatioChange = (value: string) => {
    setSelectedValueAspectRatio(value);
  };
  
  const handleCheckedValueVersion = (value: boolean) => {
    setCheckedValueVersion(value);
  };

  const getCurrentTimestamp = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleMessageSend = async () => {
    let configuration = `${CheckedValueVersion ? ', ' + 'v5' : ''}${selectedValueCategory ? ', ' + selectedValueCategory : ''}${selectedValueGrading ? ', ' + selectedValueGrading : ''}${selectedValueType ? ', ' + selectedValueType : ''}${selectedValueRealism ? ', ' + selectedValueRealism : ''}${selectedValueBackground ? ', ' + selectedValueBackground : ''}${selectedValueAspectRatio ? ', ' + selectedValueAspectRatio : ''}`;
    let newConfigMessage = `${inputValue.trim()}${configuration}`;
    const currentTime = Date.now();
    let newMessage: Message = {
      requestId: currentTime,
      text: newConfigMessage,
      hasTag: false,
      progress: "waiting start",
      img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==",
    };

    if (newMessage.text) {
      setInputValue("");
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      await Imagine(
        JSON.stringify({ prompt: newMessage.text }),
        async (data: MJMessage) => {          
          setMessages((prevMessages) =>
            prevMessages.map((message) =>
              message.requestId === newMessage.requestId
                ? {
                    ...message,
                    img: data.uri,
                    hasTag: !!data.id,
                    msgHash: data.hash,
                    msgID: data.id,
                    progress: data.progress,
                    content: data.content,
                  }
                : message
            )
          );          

          if (data.progress === "done") {
            const API_URL = "https://prod-151.westus.logic.azure.com:443/workflows/20a8ee78cf1341e5a1cba9b59c935f32/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Ixl7jyjDqRhRApvCcMm9HXnmfG_mtSeUele5YeEH2L0";
            const userFromLocalStorage: string | null = localStorage.getItem('user');
            const user: string = userFromLocalStorage !== null ? userFromLocalStorage : 'Default User';
            let image: Images = {
              User: user,
              ImageURL: data.uri,
              Message: newConfigMessage, 
              content: data.content, 
              MessageId: data.id,
              MessageHash: data.hash,
              Timestamp : getCurrentTimestamp(), 
              UpscaleBit: false, 
              VariantBit: false
            }
            try {
              const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image }),
              });
    
              if (!response.ok) {
                throw new Error('Failed to send response data to the backend.');
              }
            } catch (error) {
              console.error('Error saving image:', error);
              setMessages((prevMessages) =>
                prevMessages.map((message) =>
                  message.requestId === newMessage.requestId
                    ? {
                        ...message,
                        progress: data.progress+" : image not saved",
                      }
                    : message
                )
              );
            }
          }
        }
      );
      setInputDisable(false);      
    }
  };

  const upscale = async (
    pormpt: string,
    msgId: string,
    msgHash: string,
    index: number
  ) => {
    let newMessage: Message = {
      text: `${pormpt} upscale U${index}`,
      hasTag: false,
      progress: "waiting start",
      img: "data:image/png;base64,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",
    };

    const oldMessages = messages;
    setMessages([...oldMessages, newMessage]);
    await Upscale(
      JSON.stringify({ content: pormpt, index, msgId, msgHash }),
      async (data: MJMessage) => {
        newMessage.img = data.uri;
        newMessage.msgHash = data.hash;
        newMessage.msgID = data.id;
        newMessage.content = data.content;
        newMessage.progress = data.progress;
        setMessages([...oldMessages, newMessage]);        

        if (data.progress === "done") {
          const API_URL = "https://prod-151.westus.logic.azure.com:443/workflows/20a8ee78cf1341e5a1cba9b59c935f32/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Ixl7jyjDqRhRApvCcMm9HXnmfG_mtSeUele5YeEH2L0";
          const userFromLocalStorage: string | null = localStorage.getItem('user');
          const user: string = userFromLocalStorage !== null ? userFromLocalStorage : 'Default User';
          let image: Images = {
            User: user,
            ImageURL: data.uri,
            Message: newMessage.text, 
            content: newMessage.content, 
            MessageId: data.id,
            Timestamp : getCurrentTimestamp(), 
            UpscaleBit: true,
            VariantBit: false
          }
          try {
            const response = await fetch(API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ image }),
            });
  
            if (!response.ok) {
              throw new Error('Failed to send response data to the backend.');
            }
          } catch (error) {
            console.error('Error saving image:', error);
            setMessages((prevMessages) =>
              prevMessages.map((message) =>
                message.requestId === newMessage.requestId
                  ? {
                      ...message,
                      progress: data.progress+" : image not saved",
                    }
                  : message
              )
            );
          }
        }
      }
    );
  };

  const variation = async (
    content: string,
    msgId: string,
    msgHash: string,
    index: number
  ) => {
    let newMessage: Message = {
      text: `${content} variation V${index}`,
      hasTag: false,
      progress: "waiting start",
      img: "data:image/png;base64,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",
    };

    const oldMessages = messages;
    setMessages([...oldMessages, newMessage]);
    await Variation(        
      JSON.stringify({ content, index, msgId, msgHash }),      
      async (data: MJMessage) => {
        newMessage.img = data.uri;
        if (data.uri.endsWith(".png")) {
          newMessage.hasTag = true;
        }
        newMessage.msgHash = data.hash;
        newMessage.msgID = data.id;
        newMessage.content = data.content;
        newMessage.progress = data.progress;
        setMessages([...oldMessages, newMessage]);

        if (data.progress === "done") {
          const API_URL = "https://prod-151.westus.logic.azure.com:443/workflows/20a8ee78cf1341e5a1cba9b59c935f32/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Ixl7jyjDqRhRApvCcMm9HXnmfG_mtSeUele5YeEH2L0";
          const userFromLocalStorage: string | null = localStorage.getItem('user');
          const user: string = userFromLocalStorage !== null ? userFromLocalStorage : 'Default User';
          let image: Images = {
            User: user,
            ImageURL: data.uri,
            Message: newMessage.text, 
            content: newMessage.content, 
            MessageId: data.id,
            MessageHash: data.hash,
            Timestamp : getCurrentTimestamp(), 
            UpscaleBit: false,
            VariantBit: true
          }
          try {
            const response = await fetch(API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ image }),
            });
  
            if (!response.ok) {
              throw new Error('Failed to send response data to the backend.');
            }
          } catch (error) {
            console.error('Error saving image:', error);
            setMessages((prevMessages) =>
              prevMessages.map((message) =>
                message.requestId === newMessage.requestId
                  ? {
                      ...message,
                      progress: data.progress+" : image not saved",
                    }
                  : message
              )
            );
          }
        }
      }
    );
  };
  const tagClick = (
    content: string,
    msgId: string,
    msgHash: string,
    tag: string
  ) => {
    switch (tag) {
      case "V1":
        variation(content, msgId, msgHash, 1);
        break;
      case "V2":
        variation(content, msgId, msgHash, 2);
        break;
      case "V3":
        variation(content, msgId, msgHash, 3);
        break;
      case "V4":
        variation(content, msgId, msgHash, 4);
        break;
      case "U1":
        upscale(content, msgId, msgHash, 1);
        break;
      case "U2":
        upscale(content, msgId, msgHash, 2);
        break;
      case "U3":
        upscale(content, msgId, msgHash, 3);
        break;
      case "U4":
        upscale(content, msgId, msgHash, 4);
        break;
      default:
        break;
    }
  };

  const renderMessage = ({
    text,
    img,
    hasTag,
    msgHash,
    msgID,
    progress,
    content,
  }: Message) => {
    if ("/") { //process.env.NEXT_PUBLIC_IMAGE_PREFIX) {
      img = img.replace(
        "https://cdn.discordapp.com/",
        "/"//process.env.NEXT_PUBLIC_IMAGE_PREFIX
      );
    }

    if (isUpscale) {
      return (
        <List.Item
          className="flex flex-col space-y-4 justify-start items-start"
          style={{
            alignItems: "flex-start",
          }}
        >
          <Text>
            {text} {`(${progress})`}
          </Text>

          <Image className="ml-2 rounded-xl" width={400} src={img} />        
        </List.Item>     
      ) 
    } else if (isVarient || fromDB) {
      return (
        <List.Item
          className="flex flex-col space-y-4 justify-start items-start"
          style={{
            alignItems: "flex-start",
          }}
        >
          <Text>
            {text} {`(${progress})`}
          </Text>

          <Image className="ml-2 rounded-xl" width={400} src={img} />

            <Tag
              Data={["V1", "V2", "V3", "V4"]}
              onClick={(tag) =>
                tagClick(String(content), String(msgID), String(msgHash), tag)
              }
            />
            <Tag
              Data={["U1", "U2", "U3", "U4"]}
              onClick={(tag) =>
                tagClick(String(content), String(msgID), String(msgHash), tag)
              }
            />
        </List.Item>
      );
    } else {
      return (
        <List.Item
          className="flex flex-col space-y-4 justify-start items-start"
          style={{
            alignItems: "flex-start",
          }}
        >
          <Text>
            {text} {`(${progress})`}
          </Text>

          <Image className="ml-2 rounded-xl" width={400} src={img} />

          {hasTag && (
            <Tag
              Data={["V1", "V2", "V3", "V4"]}
              onClick={(tag) =>
                tagClick(String(content), String(msgID), String(msgHash), tag)
              }
            />
          )}
          {hasTag && (
            <Tag
              Data={["U1", "U2", "U3", "U4"]}
              onClick={(tag) =>
                tagClick(String(content), String(msgID), String(msgHash), tag)
              }
            />
          )}
        </List.Item>
      );
    }      
  };

  return ( 
    <div
      ref={containerRef}
      className="w-full mx-auto px-4 h-full xl:w-5/5 w-5/5 overflow-y-scroll"
      style={{
        height: 'calc(100vh - 96px)',
      }}
    > 
      {isLoading && (
        <div className="w-full mx-auto px-20 xl:w-5/5 w-5/5 loading-indicator">
          Loading...
        </div>
      )}  
      <List
        className="w-full mx-auto px-20 h-full xl:w-5/5 w-5/5"
        style={{
          height: "calc(100vh - 96px)",
        }}
        dataSource={messages}
        renderItem={renderMessage}
      />                
      <div className="absolute z-10 w-4/5 xl:w-4/5 right-0 bottom-10 left-0 mx-auto ">
        <TextArea
          className="w-full"
          disabled={inputDisable}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              setInputValue(`${inputValue}\n`);
              e.preventDefault();
            } else if (e.key === "Enter") {
              handleMessageSend();
              e.preventDefault();
            }
          }}
          placeholder="Describe image: : Example: exploding red lipstick,  running shoes splashing through wate"
          autoSize={{ minRows: 1, maxRows: 6 }}
          style={{ paddingRight: 30 }}
        />
        <Button
          className="absolute"
          type="primary"
          onClick={handleMessageSend}
          loading={inputDisable}
          icon={<SendOutlined style={{ color: "#000" }} />}
          title="Send"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            background: "transparent",
            border: "none",
            boxShadow: "none",
          }}
        />        
      </div>
      <div
        className="absolute z-10"
        style={{
          bottom: '45px',
          right: `${scrollbarWidth}px`,
        }}
      >
        <FloatingSettings 
          onSelectedValueCategoryChange={handleSelectedValueCategoryChange}
          onSelectedValueGradingChange={handleSelectedValueGradingChange}
          onSelectedValueTypeChange={handleSelectedValueTypeChange}
          onSelectedValueRealismChange={handleSelectedValueRealismChange}
          onSelectedValueBackgroundChange={handleSelectedValueBackgroundChange}
          onSelectedValueAspectRatioChange={handleSelectedValueAspectRatioChange} 
          onChecked={handleCheckedValueVersion}        
        />
      </div>
    </div>
  );
};

export default Index;