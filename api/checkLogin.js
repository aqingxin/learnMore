var checkLogin=function(req,res){
  if(req.session.username!==undefined){
    res.json({code:200,msg:req.session})
  }else{
    res.json({code:201,msg:'no'})
  }
}

module.exports=checkLogin