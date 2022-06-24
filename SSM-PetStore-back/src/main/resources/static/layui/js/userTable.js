$(function () {

    layui.use('element', function(){
        var element = layui.element;
        //一些事件触发
        element.on('tab(JPetStoreTable)', function(data){
            console.log(data);
        });
    });

    //登陆网站时，立刻渲染用户表
    layui.use('table', function() {
        var table = layui.table;
        var form = layui.form;

        //第一个实例
        table.render({
            elem: '#JPetStoreTable'
            , height: 600
            , url: '/account/findAllUserInfo' //数据接口,异步请求
            , page: true //开启分页
            , toolbar: '#toolbarDel'
            , cols: [[ //表头
                , {type: 'checkbox', unresize: true}
                , {field: 'userid', title: '用户名', sort: true, width: 90}
                , {field: 'password', title: '密码', width: 110}
                , {field: 'telephone', title: '电话', width: 110}
                , {field: 'email', title: '邮箱', width: 100}
                , {field: 'addr1', title: '地址1', width: 120}
                , {field: 'addr2', title: '地址2', width: 120}
                , {field: 'city', title: '城市', width: 70}
                , {
                    field: 'status', title: '账号状态', width: 100, align: "center", templet: function (d) {
                        //状态是1，则为 “启用”，状态为0，则为 “禁用”
                        if (d.status == 1) {
                            state = "<input type='checkbox'  id='status' lay-filter='status' " +
                                "checked='checked' name='status'  lay-skin='switch' lay-text='正常|禁用' >";
                        } else {
                            state = "<input type='checkbox'  id='status' lay-filter='status'  " +
                                "name='status'  lay-skin='switch' lay-text='正常|禁用' >";
                        }
                        return state;
                    }
                }
                , {align: 'center', title: '操作', width: 210, toolbar: '#toolbarAccount'}
            ]]

            , done: function (res, curr, count) {
                console.log(res);
                console.log(count);
            }
            , parseData: function (res) { //res 即为原始返回的数据
                return {
                    "code": 0, //解析接口状态
                    "msg": res.message, //解析提示文本
                    "count": res.total, //解析数据长度
                    "data": res //解析数据列表
                };
            }
        });
    })

    //用户表展示
    $("#USER").click(function () {
        console.log("点击了用户管理选项卡");
        layui.use('table', function(){
            var table = layui.table;
            var form = layui.form;

            //第一个实例
            table.render({
                elem: '#JPetStoreTable'
                ,height: 600
                ,url: '/account/findAllUserInfo' //数据接口,异步请求
                ,page: true //开启分页
                ,toolbar: '#toolbarDel'
                ,cols: [[ //表头
                    ,{type: 'checkbox', unresize:true}
                    ,{field: 'userid',title: '用户名', sort: true,width: 90}
                    ,{field: 'password', title: '密码',width: 110}
                    ,{field: 'telephone', title: '电话' ,width: 110}
                    ,{field: 'email', title: '邮箱',width: 100}
                    ,{field: 'addr1', title: '地址1' ,width: 120}
                    ,{field: 'addr2', title: '地址2' ,width: 120}
                    ,{field: 'city', title: '城市',width: 70}
                    ,{field: 'status', title: '账号状态',width: 100 ,align: "center", templet:function (d){
                            //状态是1，则为 “启用”，状态为0，则为 “禁用”
                            if (d.status == 1){
                                state = "<input type='checkbox'  id='status' lay-filter='status' " +
                                    "checked='checked' name='status'  lay-skin='switch' lay-text='正常|禁用' >";
                            } else {
                                state = "<input type='checkbox'  id='status' lay-filter='status'  " +
                                    "name='status'  lay-skin='switch' lay-text='正常|禁用' >";
                            }
                            return state;
                        }}
                    ,{align: 'center',title: '操作', width: 210 ,toolbar: '#toolbarAccount'}
                ]]

                ,done:function (res,curr,count)
                {
                    console.log(res);
                    console.log(count);
                }
                ,parseData: function(res) { //res 即为原始返回的数据
                    return {
                        "code": 0, //解析接口状态
                        "msg": res.message, //解析提示文本
                        "count": res.total, //解析数据长度
                        "data": res //解析数据列表
                    };
                }
            });
            //Switch开关的监听事件
            form.on('switch(status)', function(d){

                table.on('row(test)', function(obj){
                    console.log(obj.data);
                    console.log(d.othis.text());
                    $.ajax({
                        type : 'get',
                        url: '/account/updateStatus',
                        data: {
                            userid: obj.data.userid,
                            status: d.othis.text()
                        }
                    })

                });
                //根据业务判断是开启还是关闭

            });


            //搜索按钮的监听事件
            $('body').on('click','#searchBtn',function(){//解决了搜索键只能点击一次的bug，#搜索btn的id
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';//input的data-type
            });
            // 点击获取数据
            var  active = {
                getInfo: function () {
                    var userId=$('#select_userId').val();//#input输入框的id
                    if (userId) {
                        var index = layer.msg('查询中，请稍候...',{icon: 16,time:false,shade:0});//等待框
                        setTimeout(function(){

                            table.reload('JPetStoreTable', { //表格的id
                                url:'/account/search',//重载url，数据接口
                                where: {
                                    'userId':$.trim(userId)
                                }
                            });
                            layer.close(index);//关闭等待框
                        },800);
                    } else {
                        layer.msg("请输入编号");
                    }
                },
            };
            //批量删除监听事件
            $('body').on('click','#delAllBtn',function(){//解决了 批量删除按钮只能使用一次的bug
                var checkStatus = table.checkStatus('JPetStoreTable');
                var tableData = checkStatus.data;
                var userIds = "";
                if(tableData.length >0) {
                    for(var i=0;i<tableData.length;i++){
                        userIds += tableData[i].userid+"/";
                    }
                }
                console.log(userIds);
                layer.confirm('确定删除选中的数据？',{icon:3 ,title :"提示信息"},function (index){
                    $.ajax({
                        url : '/account/deleteInBatches',
                        type: 'get',
                        data: {userIds},
                        success:function (){
                            //重新渲染表格(不会如何重载)
                            table.render({
                                elem: '#JPetStoreTable'
                                ,height: 600
                                ,url: '/account/findAllUserInfo' //数据接口,异步请求
                                ,page: true //开启分页
                                ,toolbar: '#toolbarDel'
                                ,cols: [[ //表头
                                    ,{type: 'checkbox', unresize:true}
                                    ,{field: 'userid',title: '用户名', sort: true,width: 90}
                                    ,{field: 'password', title: '密码',width: 110}
                                    ,{field: 'telephone', title: '电话' ,width: 110}
                                    ,{field: 'email', title: '邮箱',width: 100}
                                    ,{field: 'addr1', title: '地址1' ,width: 120}
                                    ,{field: 'addr2', title: '地址2' ,width: 120}
                                    ,{field: 'city', title: '城市',width: 70}
                                    ,{field: 'status', title: '账号状态',width: 100 ,align: "center", templet:function (d){
                                            //状态是1，则为 “启用”，状态为0，则为 “禁用”
                                            if (d.status == 1){
                                                state = "<input type='checkbox'  id='status' lay-filter='status' " +
                                                    "checked='checked' name='status'  lay-skin='switch' lay-text='正常|禁用' >";
                                            } else {
                                                state = "<input type='checkbox'  id='status' lay-filter='status'  " +
                                                    "name='status'  lay-skin='switch' lay-text='正常|禁用' >";
                                            }
                                            return state;
                                        }}
                                    ,{align: 'center',title: '操作', width: 210 ,toolbar: '#toolbarAccount'}
                                ]]

                                ,done:function (res,curr,count)
                                {
                                    console.log(res);
                                    console.log(count);
                                }
                                ,parseData: function(res) { //res 即为原始返回的数据
                                    return {
                                        "code": 0, //解析接口状态
                                        "msg": res.message, //解析提示文本
                                        "count": res.total, //解析数据长度
                                        "data": res //解析数据列表
                                    };
                                }
                            });

                            layer.msg("批量删除数据成功！");
                        },
                        error:function (){
                            layer.msg("批量删除数据失败！");
                        }
                    })
                })
            })
            //工具条事件
            table.on('tool(test)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
                var data = obj.data; //获得当前行数据
                var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

                if(layEvent === 'del'){ //删除
                    layer.confirm('是否确认删除该数据', function(index){
                        obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                        layer.close(index);
                        //向服务端发送删除指令
                        $.ajax({
                                url: '/account/deleteUser',
                                type: 'get',
                                data: data,
                                success:function (){
                                    layer.msg("删除数据成功！");
                                },
                                error:function (){
                                    layer.msg("删除数据失败........！");
                                }
                            }
                        )
                    });
                } else if(layEvent === 'edit'){ //编辑
                    console.log("即将进入function of delete");
                    //do something
                    edit(obj);
                    //同步更新缓存对应的值

                } else if(layEvent === 'reset') {
                    console.log("进入重置密码");
                    //重置密码
                    layer.confirm('是否确认重置密码，重置后密码设为：123456', function (index) {
                        //向服务端发送删除指令
                        $.ajax({
                                url: '/account/resetPassword',
                                type: 'get',
                                data: data,
                                success: function () {
                                    layer.msg("重置密码成功！");
                                    obj.update({
                                        password : 123456
                                    });
                                },
                                error: function () {
                                    layer.msg("重置密码失败！");
                                }
                            }
                        )
                    })
                }
            });
            //修改信息 函数
            function edit(obj){
                layer.open({
                    type : 1,
                    content : '<div class="layui-form-item">\n' +
                        '            <label class="layui-form-label">电话:</label>\n' +
                        '            <div class="layui-input-inline" style="width: 200px">\n' +
                        '                <input type="text" id="edit_telephone" required  lay-verify="required" value='+obj.data.telephone+' autocomplete="off" class="layui-input">\n' +
                        '            </div>\n' +
                        '        </div>\n' +
                        '      <div class="layui-form-item">\n' +
                        '            <label class="layui-form-label">邮箱:</label>\n' +
                        '            <div class="layui-input-inline" style="width: 200px">\n' +
                        '                <input type="text" id="edit_email" required lay-verify="required" value='+obj.data.email+' autocomplete="off" class="layui-input">\n' +
                        '            </div>\n' +
                        '        </div>\n' +
                        '      <div class="layui-form-item">\n' +
                        '            <label class="layui-form-label">地址1:</label>\n' +
                        '            <div class="layui-input-inline" style="width: 200px">\n' +
                        '                <input type="text" id="edit_addr1" required  lay-verify="required"  value='+obj.data.addr1+' autocomplete="off" class="layui-input">\n' +
                        '            </div>\n' +
                        '        </div>\n' +
                        '      <div class="layui-form-item">\n' +
                        '            <label class="layui-form-label">地址2:</label>\n' +
                        '            <div class="layui-input-inline" style="width: 200px">\n' +
                        '                <input type="text" id="edit_addr2" required  lay-verify="required" value='+obj.data.addr2+' autocomplete="off" class="layui-input">\n' +
                        '            </div>\n' +
                        '        </div>' +
                        '      <div class="layui-form-item">\n' +
                        '            <label class="layui-form-label">城市:</label>\n' +
                        '            <div class="layui-input-inline" style="width: 200px">\n' +
                        '                <input type="text" id="edit_city" required  lay-verify="required" value='+obj.data.city+' autocomplete="off" class="layui-input">\n' +
                        '            </div>\n' +
                        '        </div>' ,

                    btn : [ '保存', '取消' ],
                    yes : function(index, layero) {
                        jQuery.ajax({
                            url : "/account/update", //异步请求的接口
                            data : {
                                userid : obj.data.userid,
                                telephone : $("#edit_telephone").val(),
                                email : $("#edit_email").val(),
                                addr1 : $("#edit_addr1").val(),
                                addr2 : $("#edit_addr2").val(),
                                city : $("#edit_city").val()
                            },
                            dataType : "text",
                            success : function(data) {
                                if(data==0){
                                    layer.msg("修改成功！");
                                    obj.update({
                                        telephone :$("#edit_telephone").val(),
                                        email : $("#edit_email").val(),
                                        addr1 : $("#edit_addr1").val(),
                                        addr2 : $("#edit_addr2").val(),
                                        city : $("#edit_city").val()
                                    });
                                }else{
                                    layer.msg("修改失败！");
                                }
                            },
                            error : function() {
                            }
                        });
                    }
                });
            }
        });
    })
})
