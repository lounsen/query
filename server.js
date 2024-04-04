/*const express = require('express');
const app = express();
const port = 3000;


// 设置允许跨域访问
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
// 设置路由，当访问根路径时返回一个 JSON 格式的数据
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
*/

const express = require('express');
const session = require('express-session');
const uuid = require('uuid'); // 用于生成唯一的Session ID
const app = express();
const port = 6060;

// 预检请求处理
/*app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
  } else {
    next();
  }
});
*/
app.use(express.json());
// 设置允许跨域访问
app.use((req, res, next) => {
  //res.setHeader('Set-Cookie', 'testCookie=testValue; HttpOnly');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, session-id');
  res.header('Access-Control-Allow-Credentials', 'true'); // 允许携带身份验证信息
  next();
});
app.use(session({
  secret: '123-321',
  resave: false,
  saveUninitialized: true,
  cookie: {
    //secure: true, // 仅在HTTPS连接下使用cookie
    //httpOnly: true, // 防止客户端脚本访问cookie
    maxAge: 3600000, // cookie过期时间，单位为毫秒
    //sameSite: 'strict' // 仅允许同站点访问
  },
  //name: 'ivan'
}));

// 模拟用户数据
const users = [
  { id: 1, username: 'user1', password: 'password1', points: 100 },
  { id: 2, username: 'user2', password: 'password2', points: 200 }
];

// 存储Session ID和用户信息的Map
const sessions = new Map();


// 用户登录路由
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
  	const sessionId = uuid.v4(); // 生成唯一的Session ID
    sessions.set(sessionId, user); // 存储Session ID和用户信息
    //console.log(session.user);
    res.json({ message: 'Login successful', sessionId });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// 积分查询路由
app.get('/points', (req, res) => {
	console.log(session.user);
	const sessionId = req.headers['session-id']; // 从请求头中获取Session ID
	const user = sessions.get(sessionId);
	//session['key'] = 'hahahahah'  // 设置session
	//res.setHeader('set-cookies', session['key']) // 保存cookie在headers中(这里修改了session，服务器会自动生成set-cookie字段)
    
  if (user) {
    res.json({ points: user.points });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
