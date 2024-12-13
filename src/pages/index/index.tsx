import React, {  useEffect, useState } from 'react';
import './index.scss'
import InputPrefixIcon from '@assets/icons/input_prefix.svg'
import { Button, Input, notification, NotificationArgsProps,message } from 'antd';
import { getPrompt, getToken, initPrompt } from '../../remote/repository/repository.ts';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/slices/slice.ts';
import { useAppSelector } from '../../store/store.ts';
import { Message, MessagePostBody, ResultType } from '../../remote/model/model.ts';

export const IndexScreen: React.FC = () => {
  const dispatch = useDispatch();
  const token = useAppSelector((state) => state.reducer.token);
  const [header, setHeader] = useState<MessagePostBody | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [result, setResult] = useState<ResultType | null>(null);
  const [resultPlain, setPlain] = useState<string | null>(null);
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [ showMessage, messageContext] = message.useMessage()
  useEffect(() => {
    getToken().then((token) => {
      dispatch(setToken(token));
      initPrompt(token).then((data) => {
        console.log('header: ', data);
        setHeader(data);
        setIsDisable(false);
      });
    });
    showMessage.info('大模型加载需要一段时间,请耐心等待');
  }, []);
  const handleClick = async () => {
    setResult(null);
    setPlain(null);
    setIsLoading(true);
    if (token && header) {
      const data: Message = {
        role: 'user',
        content: inputText,
      };
      const prompt = {
        messages: [...header.messages],
      };
      prompt.messages.push(data);
      const resultString = await getPrompt(token, prompt);
      const startIndex = resultString.indexOf('{');
      const endIndex = resultString.lastIndexOf('}');
      const str = resultString.substring(startIndex, endIndex + 1);
      console.log(str);
      try {
        const result = JSON.parse(str) as ResultType;
        setResult(result);
      } catch (e) {
        setPlain(resultString);
      }
      setIsLoading(false);
    }
  };
  return (
    <>
      {messageContext}
      <div className={'index-screen'}>
        <div className={'scope'}>
          {/*<img className={'logo'} src={LogoIcon} alt="logo" />*/}
          <div className={'slogan'}>
            <span>Command X</span>
          </div>
          <TypeAnimationPanel />
          <div className={'input-scope'}>
            <Input
              className={'input'}
              size={'large'}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={'Enter command to get help from AI'}
              prefix={
                <img className={'prefix'} src={InputPrefixIcon} alt="logo" />
              }
            />
            <Button
              className={'complete-button'}
              disabled={isDisable}
              loading={isLoading}
              onClick={handleClick}
              type={'primary'}
              size={'large'}
            >
              确定
            </Button>
          </div>
        </div>
        <div className={'result-list-container'}>
          {resultPlain && (
            <div className={'result-item-container'}>
              <ResultItem command={'Conversation'} description={resultPlain} />
            </div>
          )}
          {result &&
            result.data.hints.map((item, i) => (
              <div className={'result-item-container'}>
                <ResultItem
                  command={item.command}
                  description={item.description}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
type ResultItemProps = {
  command: string;
  description: string;
};
const ResultItem: React.FC<ResultItemProps> = (props) => {
  const Context = React.createContext({ name: 'Default' });
  type NotificationPlacement = NotificationArgsProps['placement'];
  const [api, contextHolder] = notification.useNotification();
  const handleClick = (text: string) => {
    navigator.clipboard.writeText(text);
    openNotification('topLeft', text);
  };
  const openNotification = (
    placement: NotificationPlacement,
    content: string,
  ) => {
    api.success({
      message: `复制命令`,
      description: (
        <Context.Consumer>
          {({ name }) => `${content} 复制成功`}
        </Context.Consumer>
      ),
      showProgress: true,
      placement,
    });
  };
  return (
    <>
      {contextHolder}
      <div className={'result-item'} onClick={() => handleClick(props.command)}>
        <span className={'command'}>{props.command}</span>
        <span className={'description'}>{props.description}</span>
      </div>
    </>
  );
};
const exampleCodeList = [
  'sudo apt-get update && sudo apt-get upgrade -y',
  'sudo systemctl status nginx && sudo systemctl restart nginx',
  'sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT && sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT',
  'sudo du -h --max-depth=1 / | sort -hr | head -n 5',
  'sudo crontab -e && (crontab -l; echo "0 3 * * 0 /path/to/backup.sh") | crontab -',
  "sudo lsof -i :8080 | awk '{print $2}' | xargs kill -9",
  'sudo docker build -t my-app . && sudo docker run -p 3000:3000 my-app',
  'sudo ansible-playbook -i inventory.yml site.yml --tags="install,configure"',
  'sudo openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes',
  'sudo scp -r user@remote-host:/path/to/remote/directory /path/to/local/directory',
];
const TypeAnimationPanel = () => {
  const [ currentIndex,setIndex ] = useState(0);
  const [ codeIndex,setCodeIndex ] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      if( currentIndex === exampleCodeList[codeIndex].length ){
        setIndex((prev) => 0 );
        setCodeIndex( (prev) => (prev+1)%exampleCodeList.length )
      }else{
        setIndex((prev) => prev+1 );
      }
    },100)
    return () => {
      clearInterval(timer)
    }
  },[currentIndex,codeIndex])
  return (
    <div className={'type-animation-panel'}>
      <span>{`${exampleCodeList[codeIndex].slice(0,currentIndex+1)}${ (currentIndex & 1) ? '' : '_' }`}</span>
    </div>
  )
}