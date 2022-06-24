package com.example.mypetstore_back_management.controller;

import com.alibaba.fastjson.JSONObject;
import com.example.mypetstore_back_management.domain.Account;
import com.example.mypetstore_back_management.domain.Admin;
import com.zhenzi.sms.ZhenziSmsClient;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Controller
public class SendCodeController {
    private String apiUrl = "https://sms_developer.zhenzikj.com";
    //榛子云系统上获取
    private String appId = "111116";
    private String appSecret = "84fa867d-07f3-4e4e-aa03-d959dbf1033d";
    @ResponseBody
    @RequestMapping("/sendCode")
    public boolean getCode(@RequestParam("telephone")String telephone, HttpSession httpSession){
        System.out.println(telephone);
        try {
            JSONObject json = null;
            //随机生成验证码
            String code = String.valueOf(new Random().nextInt(999999));
            //将验证码通过榛子云接口发送至手机
            ZhenziSmsClient client = new ZhenziSmsClient(apiUrl, appId, appSecret);
            Map<String, Object> params = new HashMap<String, Object>();
            //前台输入的手机号
            params.put("number",telephone);
            //这个模板id对应的是榛子云个人中心的模板id
            params.put("templateId", 8504);
            String[] templateParams = new String[2];
            templateParams[0] = code;
            templateParams[1] = "5分钟";
            params.put("templateParams", templateParams);
            String result = client.send(params);
            System.out.println(result);
            json = JSONObject.parseObject(result);
            if (json.getIntValue("code")!=0){//发送短信失败
                return  false;
            }
            //将验证码存到session中,同时存入创建时间
            //以json存放，这里使用的是阿里的fastjson
            json = new JSONObject();
            json.put("memPhone",telephone);
            json.put("code",code);
            json.put("createTime",System.currentTimeMillis());
            // 将认证码存入SESSION
            httpSession.setAttribute("code",json);
            httpSession.setAttribute("checkcode",code);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    /**
     /* @Author wyh
     * @Description    跳转发送短信页面
     * @Date 21:01 2021/5/7
     * @Param []
     * @return java.lang.String
     **/
    @RequestMapping("/goSendCode")
    public String goSendCode(){
        return "/sendCode";
    }

}
