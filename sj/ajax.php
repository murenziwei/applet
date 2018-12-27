<?php
function send_post($url,$post_data){
	$postdata=http_build_query($post_data);
	$options=array(
	'http'=>array(
	'method'=>"POST",
	"header"=>"Content-type:application/x-www-form-urlencoded",
	"content"=>$postdata,
	"timeout"=>15*60
	 )
	);
	$context=stream_context_create($options);
	$result=file_get_contents($url,false,$context);
	return $result;
}
$obj=array(
'grant_type'=>'client_credential',
'appid'=>'wx85cc33fcef6c002e',
'secret'=>'5f69315f46317969178a5fce0e390034'
);
$data=send_post("https://api.weixin.qq.com/cgi-bin/token",$obj);

?>