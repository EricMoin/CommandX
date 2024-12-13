import { Constants } from '@constants/constants';
import axios from 'axios'
import { MessagePostBody } from '../model/model.ts';
const initHint = '你要扮演一个command line helper的角色，接下来我会打出一些不完全的linux命令行指令，请你补全，并且返回命令的前5种可能的形式，以json的格式返回（你返回的消息里只有json），格式如下：\n"{\\"code\\":200,\\"data\\":{\\"input\\":\\"br ruby\\",\\"hints\\":[{\\"command\\":\\"brew\\",\\"description\\":\\" 这是一个包管理器，您当前电脑已经安装\\"},{\\"command\\":\\"brew install ruby\\",\\"description\\":\\"您可能要安装ruby,ruby是一个流行的脚本语言，被广泛用于数据计算和MacOS中\\"},{\\"command\\":\\"brew uninstall ruby\\",\\"description\\":\\"您可能要卸载ruby,如果您是因为版本不匹配而卸载，请关注官网的最新更新\\"}]}}"'
export const initPrompt = async (
  token: string,
) => {
  const data = {
    messages: [
      {
        role: "user",
        content: initHint
      }
    ]
  };
  const config = {
    method: 'post',
    url: '/api/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/yi_34b_chat',
    params: {
      access_token: token,
    },
    data : data
  };

  const response = await axios(config)
  data.messages.push({
    role: "assistant",
    content: response.data.result
  })
  return data;
}
export const getPrompt = async (token:string,data: MessagePostBody):Promise<string> => {
  const config = {
    method: 'post',
    url: '/api/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/yi_34b_chat',
    params: {
      access_token: token,
    },
    data : data
  };
  const response = await axios(config)
  return response.data.result as string;
}
export const getToken = async () =>{
  try {
    const response = await axios.post('/api/oauth/2.0/token', null, {
      params: {
        grant_type: 'client_credentials',
        client_id: Constants.apiKey,
        client_secret: Constants.secretKey
      }
    });

    const accessToken = response.data.access_token;
    console.log('Access Token:', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}