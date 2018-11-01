var http=require('http');
var express=require('express');
var mysql=require('mysql');
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var session=require('express-session');
var multer=require('multer');
var app=express();
var checkLogin=require('./checkLogin.js');

app.use('/uploadImg',express.static('uploadImg'))  
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
  secret:'keyboard cat', //值可以随便取
  // name:'userLogin',
  resave:false,
  saveUninitialized:false,
  cookie:{
    maxAge:1000*60*30
  },
 
}))

app.all('*', function(req, res, next) {   //允许跨域
  res.header("Access-Control-Allow-Origin", "http://10.21.40.155");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Access-Control-Allow-Headers",' content-type');
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

var server=http.createServer(app);
server.listen(9999,function(){
  console.log('run at 9999');
});


var connection=mysql.createConnection({   //创建数据库连接
	host:'localhost',
	user:'root',
	password:'',
	database:'website',
})

var storage = multer.diskStorage({     //指定确定上传文件应该存储在哪个文件中,如果没有设置，则使用操作系统默认的临时文件夹。
  destination: function (req, file, cb){
      cb(null, './uploadImg/')
  },
  filename: function (req, file, cb){      //用于确定文件夹中的文件名确定，如果没有设置filename，每个文件将设置为一个随机文件名，并且是没有扩展名的。
      cb(null,file.originalname)
  }
});
var upload = multer({
  storage: storage
});

app.post('/register',function(req,res){
  // console.log(req.body.username)
  var username=req.body.username;
  var password=req.body.password;
  console.log(req.body)
  let checkUserSql="SELECT * FROM users WHERE user_name=?";  
  let checkUserData=[username];

  let addUserSql="INSERT INTO  users (user_name,user_password) VALUES (?,?)";
  let addUserData=[username,password];

  connection.query(checkUserSql,checkUserData,function(err,result){  //查是否已经注册
    if(result.length===0){
      console.log(username)
      connection.query(addUserSql,addUserData,function(err,addResult){   //添加新用户
        if(err) throw err;
        res.json({code:200,msg:addResult})
      })
    }else{
      res.json({code:201,msg:'账号已注册过'})
    }
  })
})

app.post('/login',function(req,res){
  let addSql="SELECT * FROM  users WHERE user_name=?";
  let insertData=[req.body.username];
  connection.query(addSql,insertData,function(err,result){
    if(err){
      console.log(err)
      res.json({code:203,msg:err})
    }else{
      if(result.length===0){
        res.json({code:201,msg:'账号未注册'})
      }else{
        if(req.body.password!==result[0].user_password){
          res.json({code:202,msg:'密码错误'})
        }else{
          req.session.username=req.body.username;
          res.json({code:200,msg:'登录成功'})
        }
      }
    }
  })
})

// app.get('/checkLogin',function(req,res){   //查用户状态
//   if(req.session.username!==undefined){
//     res.json({code:200,msg:req.session})
//   }else{
//     res.json({code:201,msg:'no'})
//   }
// })
app.get('/checkLogin',checkLogin)

app.get('/logout',function(req,res){
  if(req.session.destroy()){
    res.json({code:200,msg:'注销成功'})
  }else{
    res.json({code:201,msg:'注销失败'})
  }
})

app.get('/gettool',function(req,res){
  let getSql="SELECT * FROM tool";
  connection.query(getSql,function(err,result){
    if(err){
      res.json({code:201,msg:'请求数据失败'})
    }else{
      res.json({code:200,msg:result})
    }
  })
})
app.get('/getOnlyTool',function(req,res){
  
  let allSql="SELECT * FROM tool";
  if(req.session.username==="admin"){
    connection.query(allSql,function(err,result){
      if(err){
        res.json({code:201,msg:'请求数据失败'})
      }else{
        res.json({code:200,msg:result})
      }
    })
  }else{
    let getSql="SELECT * FROM tool WHERE users=?";
    let getData=[req.session.username];
    connection.query(getSql,getData,function(err,result){
      if(err){
        res.json({code:201,msg:'请求数据失败'})
      }else{
        res.json({code:200,msg:result})
      }
    })
  }
})

app.post('/addTool',upload.single('file'),function(req,res){
  console.log(req.body)
  let addSql="INSERT INTO tool (tool_name,tool_location,tool_des,tool_img,users) VALUES (?,?,?,?,?)";
  let addData=[req.body.tool_name,req.body.tool_address,req.body.tool_msg,req.file.originalname,req.session.username];
  connection.query(addSql,addData,function(err,result){
    if(err){
      console.log(err)
      res.json({code:201,msg:'添加失败'})
    }else{
      res.json({code:200,msg:'添加成功'})
    }
  })
})
app.post('/modifyTool',upload.single('file'),function(req,res){
  let modifySql="UPDATE tool SET tool_name=?,tool_location=?,tool_des=?,tool_img=? WHERE id=?";
  console.log(req.file)
  let modifyData=[req.body.tool_name,req.body.tool_location,req.body.tool_des,req.file.originalname,req.body.tool_id];
  connection.query(modifySql,modifyData,function(err,result){
    if(err){
      res.json({code:201,msg:'修改失败'})
    }else{
      res.json({code:200,msg:'修改成功'})
    }
  })
})
app.get('/delteTool',function(req,res){
  let deleteSql="DELETE FROM tool WHERE id=?";
  let deelteData=[req.query.id];
  
  connection.query(deleteSql,deelteData,function(err,result){
    if(err){
      res.json({code:201,msg:'删除失败'})
    }else{
      res.json({code:200,msg:'删除成功'})
    }
  })
})