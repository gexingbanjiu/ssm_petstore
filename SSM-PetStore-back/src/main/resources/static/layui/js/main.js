


//立即函数
$(function () {

    layui.use('element', function(){
        var element = layui.element;
        //一些事件触发
        element.on('tab(demo)', function(data){
            console.log(data);
        });
    });



    //展示BIRDS信息的函数
    $("#BIRDS").click(function () {
        console.log("点击了BIRDS选项卡");
        layui.use('table', function(){
            var table = layui.table;

            layui.use('form', function(){
                var form = layui.form;
                form.render();

                //渲染表格
                table.render({
                    elem: '#JPetStoreTable'
                    ,height: 600
                    ,weight: 600
                    ,url: '/product/findAllProductInfo' //数据接口
                    ,where: {categoryId:'BIRDS'}
                    ,page: true //开启分页
                    ,skin: 'row'
                    ,even: true
                    ,toolbar: '#toolBar'//表头工具条
                    ,cols: [[ //表头
                        {field: 'selector',type: 'checkbox'}
                        ,{field: 'numbers',type: 'numbers'}
                        ,{field: 'productId', title: 'productId', sort: true}
                        ,{field: 'productName', title: 'productName'}
                        ,{field: 'itemId', title: 'itemId'}
                        ,{field: 'price', title: 'price',sort: true}
                        ,{field: 'stock', title: 'stock',sort: true}
                        //开关,控制货物是否上架   1表示上架,0表示下架
                        ,{field: 'status', title: 'status',templet:function (d) {
                                var state = "";
                                if (d.status == "1") {
                                    state = "<input type='checkbox' value='" + d.id + "' id='status' lay-filter='stat' checked='checked' name='status'  lay-skin='switch' lay-text='上架|下架' >";
                                }
                                else {
                                    state = "<input type='checkbox' value='" + d.id + "' id='status' lay-filter='stat'  name='status'  lay-skin='switch' lay-text='上架|下架' >";

                                }
                                return state;
                            }}
                        ,{fixed: 'right', width:150, align:'center', toolbar: '#operation'} //这里的toolbar值是模板元素的选择器
                    ]]
                    ,done:function (res,curr,count) {
                        console.log(res);
                    }//设置数据格式
                    ,parseData: function(res) { //res 即为原始返回的数据
                        return {
                            "code": 0, //解析接口状态
                            "msg": res.message, //解析提示文本
                            "count": res.total, //解析数据长度
                            "data": res //解析数据列表
                        };
                    }
                });


                //触发行单击事件
                table.on('row(test)', function(obj){
                //监听表格中的开关事件
                form.on('switch(stat)', function (data) {//data为1或0
                        console.log(obj.tr) //得到当前行元素对象
                        console.log(obj.data) //得到当前行数据

                        var contexts;
                        var sta;
                        var x = data.elem.checked;//判断开关状态
                        if (x==true) {
                            contexts = "上架";
                            sta='1';
                        } else {
                            contexts = "下架";
                            sta='0';
                        }
                        //自定义弹窗
                        layer.open({
                            content: "你确定要"+contexts+"吗?"
                            , btn: ['确定', '取消']
                            , yes: function (index, layero) {
                                //按钮确定【按钮一】的回调
                                console.log(data.elem);
                                console.log(data.value);
                                data.elem.checked = x;
                                //对商品进行上架或下架处理
                                $.ajax({
                                    type: "get",
                                    url:'/product/changeStatus',
                                    data: {
                                        //上下架的参数
                                        "itemId":obj.data.itemId,
                                        "status":sta
                                    },
                                    success: function (data) {
                                        if (data == 1) {
                                            layer.msg(contexts+'成功',
                                                // 提示的样式
                                                {icon: 1, time: 2000,});
                                            // 数据重载
                                            active.reload();
                                        }
                                    }
                                });
                                form.render();
                                layer.close(index);
                            }
                            , btn2: function (index, layero) {
                                //按钮【按钮二】的回调
                                data.elem.checked = !x;
                                form.render();
                                layer.close(index);
                                //return false 开启该代码可禁止点击该按钮关闭
                            }
                            , cancel: function () {
                                //右上角关闭回调
                                data.elem.checked = !x;
                                form.render();
                                // return false; //开启该代码可禁止点击该按钮关闭
                            }
                        });

                        return false;

                    });
                });



                //触发右侧工具条事件
                table.on('tool(test)', function(obj){
                    var data = obj.data; //获得当前行数据
                    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                    var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

                    console.log("当前要删除(编辑)的行为:"+data);

                    if(layEvent === 'delete'){ //删除
                        layer.confirm('真的删除行么', function(index){
                            obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                            layer.close(index);
                            //向服务端发送删除指令
                            $.ajax({
                                type:'get',
                                url: '/product/deleteProductInfo',
                                data: data,
                                success:function () {
                                    layer.msg("删除成功");
                                },
                                error:function () {
                                    layer.msg("删除失败");
                                }
                            })
                        });
                    } else if(layEvent === 'edit'){ //编辑

                        //弹出修改框
                        layer.open({
                            type:0, //layer提供了5种层类型。可传入的值有：0:（信息框，默认）,1:（页面层）,2:（iframe层）,3:（加载层）,4:（tips层）
                            title:'修改产品信息',
                            content:'<form class="layui-form layui-form-pane">' +
                                ' <div class="layui-form-item">\n' +
                                '            <label class="layui-form-label">price:</label>\n' +
                                '            <div class="layui-input-inline">\n' +
                                '                <input type="text" id="priceOfBirds" value='+data.price+' required  lay-verify="required" autocomplete="off" class="layui-input">\n' +
                                '            </div>\n' +
                                '        </div>'+
                                ' <div class="layui-form-item">\n' +
                                '            <label class="layui-form-label">stock:</label>\n' +
                                '            <div class="layui-input-inline">\n' +
                                '                <input type="text" id="stockOfBirds" value='+data.stock+' required  lay-verify="required" autocomplete="off" class="layui-input">\n' +
                                '            </div>\n' +
                                '        </div>'+
                                '</form>'
                            ,btn:['save','cancel']
                            ,yes:function () {

                                var newProductPrice = $('#priceOfBirds').val();
                                var newProductStock = $('#stockOfBirds').val();

                                if (data.price==newProductPrice&&data.stock==newProductStock)
                                {
                                    layer.msg("未做更改");
                                }else {
                                    data.price=newProductPrice;
                                    data.stock=newProductStock;
                                    $.ajax({
                                        type:'get',
                                        url:'/product/updateProductInfo',
                                        data:data,
                                        success:function () {
                                            layer.msg("编辑成功");
                                            //同步更新缓存对应的值
                                            obj.update({
                                                price:newProductPrice,
                                                stock:newProductStock
                                            });
                                        },
                                        error:function () {
                                            layer.msg("编辑失败");
                                        }
                                    })
                                }
                            }
                        })

                    }
                })

                //触发复选框事件
                table.on('checkbox(test)', function(obj){
                    console.log(obj); //当前行的一些常用操作集合
                    console.log(obj.checked); //当前是否选中状态
                    console.log(obj.data); //选中行的相关数据
                    console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
                });

                //触发头部工具栏事件
                table.on('toolbar(test)', function(obj){
                    var checkStatus = table.checkStatus(obj.config.id);
                    layui.use('form', function(){
                        var form = layui.form;
                        form.render();
                        switch(obj.event){
                            //点击添加按钮
                            case 'add':
                                layer.open({
                                    type:0,
                                    title:'新增商品',
                                    //弹出表单
                                    content:'<form class="layui-form layui-form-pane" action="#">\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">productId</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <select id="productIdOfBirdsInSelect" name="productId" lay-verify="required">\n' +
                                        '                    <option value=""></option>\n' +
                                        '                    <option id="AV-CB-01" value="AV-CB-01">AV-CB-01</option>\n' +
                                        '                    <option id="AV-SB-02" value="AV-SB-02">AV-SB-02</option>\n' +
                                        '                </select>\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">productName</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <select id="productNameOfBirdsInSelect" name="productName" lay-verify="required">\n' +
                                        '                    <option value=""></option>\n' +
                                        '                    <option value="Amazon Parrot">Amazon Parrot</option>\n' +
                                        '                    <option value="Finch">Finch</option>\n' +
                                        '                </select>\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">itemId:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addItemIdOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">price:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addPriceOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n'+
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">stock:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addStockOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '    </form>',
                                    btn:['add','cancel'],
                                    //点击保存
                                    yes:function () {
                                        let item = new Object();
                                        item.categoryId='BIRDS';
                                        item.productId=$("#productIdOfBirdsInSelect").find("option:selected").val();
                                        item.productName=$("#productNameOfBirdsInSelect").find("option:selected").val();
                                        item.itemId=$("#addItemIdOfBirds").val();
                                        item.listPrice=$("#addPriceOfBirds").val();
                                        item.quantity=$("#addStockOfBirds").val();
                                        item.status="1";
                                        //给服务器发送请求
                                        $.ajax({
                                            url:'/product/insertProductInfo',
                                            data:item,
                                            success:function () {
                                                table.reload('JPetStoreTable');
                                                layer.msg('添加成功');
                                            },
                                            error:function () {
                                                layer.msg("添加失败");
                                            }
                                        })

                                    }
                                })
                                form.render();
                                break;
                            //点击批量删除按钮
                            case 'deleteBatch':
                                layer.msg('批量删除');
                                break;
                        };
                    });

                });

                //触发行双击事件
                table.on('rowDouble(test)', function(obj){
                    console.log(obj.tr) //得到当前行元素对象
                    console.log(obj.data) //得到当前行数据
                    $.ajax({
                        type:'get',
                        url:'/product/getItemImage',
                        data:{'itemId': obj.data.itemId},
                        success:function (data) {
                            console.log("获得的图片url为:"+data);
                            layer.open({
                                type:0,
                                title:'item information',
                                content:'<table class="layui-table" >\n' +
                                    '    <tbody>\n' +
                                    '    <tr>\n' +
                                    '        <td colspan="2">BIRDS</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td colspan="2"><img src='+data+'></td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>productId:</td>\n' +
                                    '        <td>'+obj.data.productId+'</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>productName:</td>\n' +
                                    '        <td>'+obj.data.productName+'</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>price:</td>\n' +
                                    '        <td>'+obj.data.price+'</td>\n' +
                                    '    </tr>\n' +
                                    '\n' +
                                    '    <tr>\n' +
                                    '        <td>stock:</td>\n' +
                                    '        <td>'+obj.data.stock+'</td>\n' +
                                    '    </tr>\n' +
                                    '    </tbody>\n' +
                                    '</table>'
                            })
                        }
                    })

                });
            });


        })

    });

    $("#CATS").click(function () {
        console.log("点击了BIRDS选项卡");
        layui.use('table', function(){
            var table = layui.table;

            layui.use('form', function(){
                var form = layui.form;
                form.render();

                //渲染表格
                table.render({
                    elem: '#JPetStoreTable'
                    ,height: 600
                    ,weight: 600
                    ,url: '/product/findAllProductInfo' //数据接口
                    ,where: {categoryId:'CATS'}
                    ,page: true //开启分页
                    ,skin: 'row'
                    ,even: true
                    ,toolbar: '#toolBar'//表头工具条
                    ,cols: [[ //表头
                        {field: 'selector',type: 'checkbox'}
                        ,{field: 'numbers',type: 'numbers'}
                        ,{field: 'productId', title: 'productId', sort: true}
                        ,{field: 'productName', title: 'productName'}
                        ,{field: 'itemId', title: 'itemId'}
                        ,{field: 'price', title: 'price',sort: true}
                        ,{field: 'stock', title: 'stock',sort: true}
                        //开关,控制货物是否上架   1表示上架,0表示下架
                        ,{field: 'status', title: 'status',templet:function (d) {
                                var state = "";
                                if (d.status == "1") {
                                    state = "<input type='checkbox' value='" + d.id + "' id='status' lay-filter='stat' checked='checked' name='status'  lay-skin='switch' lay-text='上架|下架' >";
                                }
                                else {
                                    state = "<input type='checkbox' value='" + d.id + "' id='status' lay-filter='stat'  name='status'  lay-skin='switch' lay-text='上架|下架' >";

                                }
                                return state;
                            }}
                        ,{fixed: 'right', width:150, align:'center', toolbar: '#operation'} //这里的toolbar值是模板元素的选择器
                    ]]
                    ,done:function (res,curr,count) {
                        console.log(res);
                    }//设置数据格式
                    ,parseData: function(res) { //res 即为原始返回的数据
                        return {
                            "code": 0, //解析接口状态
                            "msg": res.message, //解析提示文本
                            "count": res.total, //解析数据长度
                            "data": res //解析数据列表
                        };
                    }
                });


                //触发行单击事件
                table.on('row(test)', function(obj){
                    //监听表格中的开关事件
                    form.on('switch(stat)', function (data) {//data为1或0
                        console.log(obj.tr) //得到当前行元素对象
                        console.log(obj.data) //得到当前行数据

                        var contexts;
                        var sta;
                        var x = data.elem.checked;//判断开关状态
                        if (x==true) {
                            contexts = "上架";
                            sta='1';
                        } else {
                            contexts = "下架";
                            sta='0';
                        }
                        //自定义弹窗
                        layer.open({
                            content: "你确定要"+contexts+"吗?"
                            , btn: ['确定', '取消']
                            , yes: function (index, layero) {
                                //按钮确定【按钮一】的回调
                                console.log(data.elem);
                                console.log(data.value);
                                data.elem.checked = x;
                                //对商品进行上架或下架处理
                                $.ajax({
                                    type: "get",
                                    url:'/product/changeStatus',
                                    data: {
                                        //上下架的参数
                                        "itemId":obj.data.itemId,
                                        "status":sta
                                    },
                                    success: function (data) {
                                        if (data == 1) {
                                            layer.msg(contexts+'成功',
                                                // 提示的样式
                                                {icon: 1, time: 2000,});
                                            // 数据重载
                                            active.reload();
                                        }
                                    }
                                });
                                form.render();
                                layer.close(index);
                            }
                            , btn2: function (index, layero) {
                                //按钮【按钮二】的回调
                                data.elem.checked = !x;
                                form.render();
                                layer.close(index);
                                //return false 开启该代码可禁止点击该按钮关闭
                            }
                            , cancel: function () {
                                //右上角关闭回调
                                data.elem.checked = !x;
                                form.render();
                                // return false; //开启该代码可禁止点击该按钮关闭
                            }
                        });

                        return false;

                    });
                });



                //触发右侧工具条事件
                table.on('tool(test)', function(obj){
                    var data = obj.data; //获得当前行数据
                    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                    var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

                    console.log("当前要删除(编辑)的行为:"+data);

                    if(layEvent === 'delete'){ //删除
                        layer.confirm('真的删除行么', function(index){
                            obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                            layer.close(index);
                            //向服务端发送删除指令
                            $.ajax({
                                type:'get',
                                url: '/product/deleteProductInfo',
                                data: data,
                                success:function () {
                                    layer.msg("删除成功");
                                },
                                error:function () {
                                    layer.msg("删除失败");
                                }
                            })
                        });
                    } else if(layEvent === 'edit'){ //编辑

                        //弹出修改框
                        layer.open({
                            type:0, //layer提供了5种层类型。可传入的值有：0:（信息框，默认）,1:（页面层）,2:（iframe层）,3:（加载层）,4:（tips层）
                            title:'修改产品信息',
                            content:'<form class="layui-form layui-form-pane">' +
                                ' <div class="layui-form-item">\n' +
                                '            <label class="layui-form-label">price:</label>\n' +
                                '            <div class="layui-input-inline">\n' +
                                '                <input type="text" id="priceOfBirds" value='+data.price+' required  lay-verify="required" autocomplete="off" class="layui-input">\n' +
                                '            </div>\n' +
                                '        </div>'+
                                ' <div class="layui-form-item">\n' +
                                '            <label class="layui-form-label">stock:</label>\n' +
                                '            <div class="layui-input-inline">\n' +
                                '                <input type="text" id="stockOfBirds" value='+data.stock+' required  lay-verify="required" autocomplete="off" class="layui-input">\n' +
                                '            </div>\n' +
                                '        </div>'+
                                '</form>'
                            ,btn:['save','cancel']
                            ,yes:function () {

                                var newProductPrice = $('#priceOfBirds').val();
                                var newProductStock = $('#stockOfBirds').val();

                                if (data.price==newProductPrice&&data.stock==newProductStock)
                                {
                                    layer.msg("未做更改");
                                }else {
                                    data.price=newProductPrice;
                                    data.stock=newProductStock;
                                    $.ajax({
                                        type:'get',
                                        url:'/product/updateProductInfo',
                                        data:data,
                                        success:function () {
                                            layer.msg("编辑成功");
                                            //同步更新缓存对应的值
                                            obj.update({
                                                price:newProductPrice,
                                                stock:newProductStock
                                            });
                                        },
                                        error:function () {
                                            layer.msg("编辑失败");
                                        }
                                    })
                                }
                            }
                        })

                    }
                })

                //触发复选框事件
                table.on('checkbox(test)', function(obj){
                    console.log(obj); //当前行的一些常用操作集合
                    console.log(obj.checked); //当前是否选中状态
                    console.log(obj.data); //选中行的相关数据
                    console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
                });

                //触发头部工具栏事件
                table.on('toolbar(test)', function(obj){
                    var checkStatus = table.checkStatus(obj.config.id);
                    layui.use('form', function(){
                        var form = layui.form;
                        form.render();
                        switch(obj.event){
                            //点击添加按钮
                            case 'add':
                                layer.open({
                                    type:0,
                                    title:'新增商品',
                                    //弹出表单
                                    content:'<form class="layui-form layui-form-pane" action="#">\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">productId</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <select id="productIdOfBirdsInSelect" name="productId" lay-verify="required">\n' +
                                        '                    <option value=""></option>\n' +
                                        '                    <option id="FL-DLH-02" value="FL-DLH-02">FL-DLH-02</option>\n' +
                                        '                    <option id="FL-DSH-01" value="FL-DSH-01">FL-DSH-01</option>\n' +
                                        '                </select>\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">productName</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <select id="productNameOfBirdsInSelect" name="productName" lay-verify="required">\n' +
                                        '                    <option value=""></option>\n' +
                                        '                    <option value="Persian">Persian</option>\n' +
                                        '                    <option value="Manx">Manx</option>\n' +
                                        '                </select>\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">itemId:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addItemIdOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">price:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addPriceOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n'+
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">stock:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addStockOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '    </form>',
                                    btn:['add','cancel'],
                                    //点击保存
                                    yes:function () {
                                        let item = new Object();
                                        item.categoryId='BIRDS';
                                        item.productId=$("#productIdOfBirdsInSelect").find("option:selected").val();
                                        item.productName=$("#productNameOfBirdsInSelect").find("option:selected").val();
                                        item.itemId=$("#addItemIdOfBirds").val();
                                        item.listPrice=$("#addPriceOfBirds").val();
                                        item.quantity=$("#addStockOfBirds").val();
                                        item.status="1";
                                        //给服务器发送请求
                                        $.ajax({
                                            url:'/product/insertProductInfo',
                                            data:item,
                                            success:function () {
                                                table.reload('JPetStoreTable');
                                                layer.msg('添加成功');
                                            },
                                            error:function () {
                                                layer.msg("添加失败");
                                            }
                                        })

                                    }
                                })
                                form.render();
                                break;
                            //点击批量删除按钮
                            case 'deleteBatch':
                                layer.msg('批量删除');
                                break;
                        };
                    });

                });

                //触发行双击事件
                table.on('rowDouble(test)', function(obj){
                    console.log(obj.tr) //得到当前行元素对象
                    console.log(obj.data) //得到当前行数据
                    $.ajax({
                        type:'get',
                        url:'/product/getItemImage',
                        data:{'itemId': obj.data.itemId},
                        success:function (data) {
                            console.log("获得的图片url为:"+data);
                            layer.open({
                                type:0,
                                title:'item information',
                                content:'<table class="layui-table" >\n' +
                                    '    <tbody>\n' +
                                    '    <tr>\n' +
                                    '        <td colspan="2">BIRDS</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td colspan="2"><img src='+data+'></td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>productId:</td>\n' +
                                    '        <td>'+obj.data.productId+'</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>productName:</td>\n' +
                                    '        <td>'+obj.data.productName+'</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>price:</td>\n' +
                                    '        <td>'+obj.data.price+'</td>\n' +
                                    '    </tr>\n' +
                                    '\n' +
                                    '    <tr>\n' +
                                    '        <td>stock:</td>\n' +
                                    '        <td>'+obj.data.stock+'</td>\n' +
                                    '    </tr>\n' +
                                    '    </tbody>\n' +
                                    '</table>'
                            })
                        }
                    })

                });
            });


        })

    });

    $("#DOGS").click(function () {
        console.log("点击了BIRDS选项卡");
        layui.use('table', function(){
            var table = layui.table;

            layui.use('form', function(){
                var form = layui.form;
                form.render();

                //渲染表格
                table.render({
                    elem: '#JPetStoreTable'
                    ,height: 600
                    ,weight: 600
                    ,url: '/product/findAllProductInfo' //数据接口
                    ,where: {categoryId:'DOGS'}
                    ,page: true //开启分页
                    ,skin: 'row'
                    ,even: true
                    ,toolbar: '#toolBar'//表头工具条
                    ,cols: [[ //表头
                        {field: 'selector',type: 'checkbox'}
                        ,{field: 'numbers',type: 'numbers'}
                        ,{field: 'productId', title: 'productId', sort: true}
                        ,{field: 'productName', title: 'productName'}
                        ,{field: 'itemId', title: 'itemId'}
                        ,{field: 'price', title: 'price',sort: true}
                        ,{field: 'stock', title: 'stock',sort: true}
                        //开关,控制货物是否上架   1表示上架,0表示下架
                        ,{field: 'status', title: 'status',templet:function (d) {
                                var state = "";
                                if (d.status == "1") {
                                    state = "<input type='checkbox' value='" + d.id + "' id='status' lay-filter='stat' checked='checked' name='status'  lay-skin='switch' lay-text='上架|下架' >";
                                }
                                else {
                                    state = "<input type='checkbox' value='" + d.id + "' id='status' lay-filter='stat'  name='status'  lay-skin='switch' lay-text='上架|下架' >";

                                }
                                return state;
                            }}
                        ,{fixed: 'right', width:150, align:'center', toolbar: '#operation'} //这里的toolbar值是模板元素的选择器
                    ]]
                    ,done:function (res,curr,count) {
                        console.log(res);
                    }//设置数据格式
                    ,parseData: function(res) { //res 即为原始返回的数据
                        return {
                            "code": 0, //解析接口状态
                            "msg": res.message, //解析提示文本
                            "count": res.total, //解析数据长度
                            "data": res //解析数据列表
                        };
                    }
                });


                //触发行单击事件
                table.on('row(test)', function(obj){
                    //监听表格中的开关事件
                    form.on('switch(stat)', function (data) {//data为1或0
                        console.log(obj.tr) //得到当前行元素对象
                        console.log(obj.data) //得到当前行数据

                        var contexts;
                        var sta;
                        var x = data.elem.checked;//判断开关状态
                        if (x==true) {
                            contexts = "上架";
                            sta='1';
                        } else {
                            contexts = "下架";
                            sta='0';
                        }
                        //自定义弹窗
                        layer.open({
                            content: "你确定要"+contexts+"吗?"
                            , btn: ['确定', '取消']
                            , yes: function (index, layero) {
                                //按钮确定【按钮一】的回调
                                console.log(data.elem);
                                console.log(data.value);
                                data.elem.checked = x;
                                //对商品进行上架或下架处理
                                $.ajax({
                                    type: "get",
                                    url:'/product/changeStatus',
                                    data: {
                                        //上下架的参数
                                        "itemId":obj.data.itemId,
                                        "status":sta
                                    },
                                    success: function (data) {
                                        if (data == 1) {
                                            layer.msg(contexts+'成功',
                                                // 提示的样式
                                                {icon: 1, time: 2000,});
                                            // 数据重载
                                            active.reload();
                                        }
                                    }
                                });
                                form.render();
                                layer.close(index);
                            }
                            , btn2: function (index, layero) {
                                //按钮【按钮二】的回调
                                data.elem.checked = !x;
                                form.render();
                                layer.close(index);
                                //return false 开启该代码可禁止点击该按钮关闭
                            }
                            , cancel: function () {
                                //右上角关闭回调
                                data.elem.checked = !x;
                                form.render();
                                // return false; //开启该代码可禁止点击该按钮关闭
                            }
                        });

                        return false;

                    });
                });



                //触发右侧工具条事件
                table.on('tool(test)', function(obj){
                    var data = obj.data; //获得当前行数据
                    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                    var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

                    console.log("当前要删除(编辑)的行为:"+data);

                    if(layEvent === 'delete'){ //删除
                        layer.confirm('真的删除行么', function(index){
                            obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                            layer.close(index);
                            //向服务端发送删除指令
                            $.ajax({
                                type:'get',
                                url: '/product/deleteProductInfo',
                                data: data,
                                success:function () {
                                    layer.msg("删除成功");
                                },
                                error:function () {
                                    layer.msg("删除失败");
                                }
                            })
                        });
                    } else if(layEvent === 'edit'){ //编辑

                        //弹出修改框
                        layer.open({
                            type:0, //layer提供了5种层类型。可传入的值有：0:（信息框，默认）,1:（页面层）,2:（iframe层）,3:（加载层）,4:（tips层）
                            title:'修改产品信息',
                            content:'<form class="layui-form layui-form-pane">' +
                                ' <div class="layui-form-item">\n' +
                                '            <label class="layui-form-label">price:</label>\n' +
                                '            <div class="layui-input-inline">\n' +
                                '                <input type="text" id="priceOfBirds" value='+data.price+' required  lay-verify="required" autocomplete="off" class="layui-input">\n' +
                                '            </div>\n' +
                                '        </div>'+
                                ' <div class="layui-form-item">\n' +
                                '            <label class="layui-form-label">stock:</label>\n' +
                                '            <div class="layui-input-inline">\n' +
                                '                <input type="text" id="stockOfBirds" value='+data.stock+' required  lay-verify="required" autocomplete="off" class="layui-input">\n' +
                                '            </div>\n' +
                                '        </div>'+
                                '</form>'
                            ,btn:['save','cancel']
                            ,yes:function () {

                                var newProductPrice = $('#priceOfBirds').val();
                                var newProductStock = $('#stockOfBirds').val();

                                if (data.price==newProductPrice&&data.stock==newProductStock)
                                {
                                    layer.msg("未做更改");
                                }else {
                                    data.price=newProductPrice;
                                    data.stock=newProductStock;
                                    $.ajax({
                                        type:'get',
                                        url:'/product/updateProductInfo',
                                        data:data,
                                        success:function () {
                                            layer.msg("编辑成功");
                                            //同步更新缓存对应的值
                                            obj.update({
                                                price:newProductPrice,
                                                stock:newProductStock
                                            });
                                        },
                                        error:function () {
                                            layer.msg("编辑失败");
                                        }
                                    })
                                }
                            }
                        })

                    }
                })

                //触发复选框事件
                table.on('checkbox(test)', function(obj){
                    console.log(obj); //当前行的一些常用操作集合
                    console.log(obj.checked); //当前是否选中状态
                    console.log(obj.data); //选中行的相关数据
                    console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
                });

                //触发头部工具栏事件
                table.on('toolbar(test)', function(obj){
                    var checkStatus = table.checkStatus(obj.config.id);
                    layui.use('form', function(){
                        var form = layui.form;
                        form.render();
                        switch(obj.event){
                            //点击添加按钮
                            case 'add':
                                layer.open({
                                    type:0,
                                    title:'新增商品',
                                    //弹出表单
                                    content:'<form class="layui-form layui-form-pane" action="#">\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">productId</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <select id="productIdOfBirdsInSelect" name="productId" lay-verify="required">\n' +
                                        '                    <option value=""></option>\n' +
                                        '                    <option id="K9-BD-01" value="K9-BD-01">K9-BD-01</option>\n' +
                                        '                    <option id="K9-CW-01" value="K9-CW-01">K9-CW-01</option>\n' +
                                        '                    <option id="K9-DL-01" value="K9-DL-01">K9-DL-01</option>\n' +
                                        '                    <option id="K9-PO-02" value="K9-PO-02">K9-PO-02</option>\n' +
                                        '                    <option id="K9-RT-01" value="K9-RT-01">K9-RT-01</option>\n' +
                                        '                    <option id="K9-RT-02" value="AV-SB-02">K9-RT-02</option>\n' +
                                        '                </select>\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">productName</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <select id="productNameOfBirdsInSelect" name="productName" lay-verify="required">\n' +
                                        '                    <option value=""></option>\n' +
                                        '                    <option value="Bulldog">Bulldog</option>\n' +
                                        '                    <option value="Chihuahua">Chihuahua</option>\n' +
                                        '                    <option value="Dalmation">Dalmation</option>\n' +
                                        '                    <option value="Poodle">Poodle</option>\n' +
                                        '                    <option value="Golden Retriever">Golden Retriever</option>\n' +
                                        '                    <option value="Labrador Retriever">Labrador Retriever</option>\n' +
                                        '                </select>\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">itemId:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addItemIdOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">price:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addPriceOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n'+
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">stock:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addStockOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '    </form>',
                                    btn:['add','cancel'],
                                    //点击保存
                                    yes:function () {
                                        let item = new Object();
                                        item.categoryId='BIRDS';
                                        item.productId=$("#productIdOfBirdsInSelect").find("option:selected").val();
                                        item.productName=$("#productNameOfBirdsInSelect").find("option:selected").val();
                                        item.itemId=$("#addItemIdOfBirds").val();
                                        item.listPrice=$("#addPriceOfBirds").val();
                                        item.quantity=$("#addStockOfBirds").val();
                                        item.status="1";
                                        //给服务器发送请求
                                        $.ajax({
                                            url:'/product/insertProductInfo',
                                            data:item,
                                            success:function () {
                                                table.reload('JPetStoreTable');
                                                layer.msg('添加成功');
                                            },
                                            error:function () {
                                                layer.msg("添加失败");
                                            }
                                        })

                                    }
                                })
                                form.render();
                                break;
                            //点击批量删除按钮
                            case 'deleteBatch':
                                layer.msg('批量删除');
                                break;
                        };
                    });

                });

                //触发行双击事件
                table.on('rowDouble(test)', function(obj){
                    console.log(obj.tr) //得到当前行元素对象
                    console.log(obj.data) //得到当前行数据
                    $.ajax({
                        type:'get',
                        url:'/product/getItemImage',
                        data:{'itemId': obj.data.itemId},
                        success:function (data) {
                            console.log("获得的图片url为:"+data);
                            layer.open({
                                type:0,
                                title:'item information',
                                content:'<table class="layui-table" >\n' +
                                    '    <tbody>\n' +
                                    '    <tr>\n' +
                                    '        <td colspan="2">BIRDS</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td colspan="2"><img src='+data+'></td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>productId:</td>\n' +
                                    '        <td>'+obj.data.productId+'</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>productName:</td>\n' +
                                    '        <td>'+obj.data.productName+'</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>price:</td>\n' +
                                    '        <td>'+obj.data.price+'</td>\n' +
                                    '    </tr>\n' +
                                    '\n' +
                                    '    <tr>\n' +
                                    '        <td>stock:</td>\n' +
                                    '        <td>'+obj.data.stock+'</td>\n' +
                                    '    </tr>\n' +
                                    '    </tbody>\n' +
                                    '</table>'
                            })
                        }
                    })

                });
            });


        })

    });

    $("#FISH").click(function () {
        console.log("点击了BIRDS选项卡");
        layui.use('table', function(){
            var table = layui.table;

            layui.use('form', function(){
                var form = layui.form;
                form.render();

                //渲染表格
                table.render({
                    elem: '#JPetStoreTable'
                    ,height: 600
                    ,weight: 600
                    ,url: '/product/findAllProductInfo' //数据接口
                    ,where: {categoryId:'FISH'}
                    ,page: true //开启分页
                    ,skin: 'row'
                    ,even: true
                    ,toolbar: '#toolBar'//表头工具条
                    ,cols: [[ //表头
                        {field: 'selector',type: 'checkbox'}
                        ,{field: 'numbers',type: 'numbers'}
                        ,{field: 'productId', title: 'productId', sort: true}
                        ,{field: 'productName', title: 'productName'}
                        ,{field: 'itemId', title: 'itemId'}
                        ,{field: 'price', title: 'price',sort: true}
                        ,{field: 'stock', title: 'stock',sort: true}
                        //开关,控制货物是否上架   1表示上架,0表示下架
                        ,{field: 'status', title: 'status',templet:function (d) {
                                var state = "";
                                if (d.status == "1") {
                                    state = "<input type='checkbox' value='" + d.id + "' id='status' lay-filter='stat' checked='checked' name='status'  lay-skin='switch' lay-text='上架|下架' >";
                                }
                                else {
                                    state = "<input type='checkbox' value='" + d.id + "' id='status' lay-filter='stat'  name='status'  lay-skin='switch' lay-text='上架|下架' >";

                                }
                                return state;
                            }}
                        ,{fixed: 'right', width:150, align:'center', toolbar: '#operation'} //这里的toolbar值是模板元素的选择器
                    ]]
                    ,done:function (res,curr,count) {
                        console.log(res);
                    }//设置数据格式
                    ,parseData: function(res) { //res 即为原始返回的数据
                        return {
                            "code": 0, //解析接口状态
                            "msg": res.message, //解析提示文本
                            "count": res.total, //解析数据长度
                            "data": res //解析数据列表
                        };
                    }
                });


                //触发行单击事件
                table.on('row(test)', function(obj){
                    //监听表格中的开关事件
                    form.on('switch(stat)', function (data) {//data为1或0
                        console.log(obj.tr) //得到当前行元素对象
                        console.log(obj.data) //得到当前行数据

                        var contexts;
                        var sta;
                        var x = data.elem.checked;//判断开关状态
                        if (x==true) {
                            contexts = "上架";
                            sta='1';
                        } else {
                            contexts = "下架";
                            sta='0';
                        }
                        //自定义弹窗
                        layer.open({
                            content: "你确定要"+contexts+"吗?"
                            , btn: ['确定', '取消']
                            , yes: function (index, layero) {
                                //按钮确定【按钮一】的回调
                                console.log(data.elem);
                                console.log(data.value);
                                data.elem.checked = x;
                                //对商品进行上架或下架处理
                                $.ajax({
                                    type: "get",
                                    url:'/product/changeStatus',
                                    data: {
                                        //上下架的参数
                                        "itemId":obj.data.itemId,
                                        "status":sta
                                    },
                                    success: function (data) {
                                        if (data == 1) {
                                            layer.msg(contexts+'成功',
                                                // 提示的样式
                                                {icon: 1, time: 2000,});
                                            // 数据重载
                                            active.reload();
                                        }
                                    }
                                });
                                form.render();
                                layer.close(index);
                            }
                            , btn2: function (index, layero) {
                                //按钮【按钮二】的回调
                                data.elem.checked = !x;
                                form.render();
                                layer.close(index);
                                //return false 开启该代码可禁止点击该按钮关闭
                            }
                            , cancel: function () {
                                //右上角关闭回调
                                data.elem.checked = !x;
                                form.render();
                                // return false; //开启该代码可禁止点击该按钮关闭
                            }
                        });

                        return false;

                    });
                });



                //触发右侧工具条事件
                table.on('tool(test)', function(obj){
                    var data = obj.data; //获得当前行数据
                    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                    var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

                    console.log("当前要删除(编辑)的行为:"+data);

                    if(layEvent === 'delete'){ //删除
                        layer.confirm('真的删除行么', function(index){
                            obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                            layer.close(index);
                            //向服务端发送删除指令
                            $.ajax({
                                type:'get',
                                url: '/product/deleteProductInfo',
                                data: data,
                                success:function () {
                                    layer.msg("删除成功");
                                },
                                error:function () {
                                    layer.msg("删除失败");
                                }
                            })
                        });
                    } else if(layEvent === 'edit'){ //编辑

                        //弹出修改框
                        layer.open({
                            type:0, //layer提供了5种层类型。可传入的值有：0:（信息框，默认）,1:（页面层）,2:（iframe层）,3:（加载层）,4:（tips层）
                            title:'修改产品信息',
                            content:'<form class="layui-form layui-form-pane">' +
                                ' <div class="layui-form-item">\n' +
                                '            <label class="layui-form-label">price:</label>\n' +
                                '            <div class="layui-input-inline">\n' +
                                '                <input type="text" id="priceOfBirds" value='+data.price+' required  lay-verify="required" autocomplete="off" class="layui-input">\n' +
                                '            </div>\n' +
                                '        </div>'+
                                ' <div class="layui-form-item">\n' +
                                '            <label class="layui-form-label">stock:</label>\n' +
                                '            <div class="layui-input-inline">\n' +
                                '                <input type="text" id="stockOfBirds" value='+data.stock+' required  lay-verify="required" autocomplete="off" class="layui-input">\n' +
                                '            </div>\n' +
                                '        </div>'+
                                '</form>'
                            ,btn:['save','cancel']
                            ,yes:function () {

                                var newProductPrice = $('#priceOfBirds').val();
                                var newProductStock = $('#stockOfBirds').val();

                                if (data.price==newProductPrice&&data.stock==newProductStock)
                                {
                                    layer.msg("未做更改");
                                }else {
                                    data.price=newProductPrice;
                                    data.stock=newProductStock;
                                    $.ajax({
                                        type:'get',
                                        url:'/product/updateProductInfo',
                                        data:data,
                                        success:function () {
                                            layer.msg("编辑成功");
                                            //同步更新缓存对应的值
                                            obj.update({
                                                price:newProductPrice,
                                                stock:newProductStock
                                            });
                                        },
                                        error:function () {
                                            layer.msg("编辑失败");
                                        }
                                    })
                                }
                            }
                        })

                    }
                })

                //触发复选框事件
                table.on('checkbox(test)', function(obj){
                    console.log(obj); //当前行的一些常用操作集合
                    console.log(obj.checked); //当前是否选中状态
                    console.log(obj.data); //选中行的相关数据
                    console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
                });

                //触发头部工具栏事件
                table.on('toolbar(test)', function(obj){
                    var checkStatus = table.checkStatus(obj.config.id);
                    layui.use('form', function(){
                        var form = layui.form;
                        form.render();
                        switch(obj.event){
                            //点击添加按钮
                            case 'add':
                                layer.open({
                                    type:0,
                                    title:'新增商品',
                                    //弹出表单
                                    content:'<form class="layui-form layui-form-pane" action="#">\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">productId</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <select id="productIdOfBirdsInSelect" name="productId" lay-verify="required">\n' +
                                        '                    <option value=""></option>\n' +
                                        '                    <option id="FI-FW-01" value="FI-FW-01">FI-FW-01</option>\n' +
                                        '                    <option id="FI-FW-02" value="FI-FW-02">FI-FW-02</option>\n' +
                                        '                    <option id="FI-SW-01" value="FI-SW-01">FI-SW-01</option>\n' +
                                        '                    <option id="FI-SW-02" value="FI-SW-02">FI-SW-02</option>\n' +
                                        '                </select>\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">productName</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <select id="productNameOfBirdsInSelect" name="productName" lay-verify="required">\n' +
                                        '                    <option value=""></option>\n' +
                                        '                    <option value="Koi">Koi</option>\n' +
                                        '                    <option value="Goldfish">Goldfish</option>\n' +
                                        '                    <option value="Angelfish">Angelfish</option>\n' +
                                        '                    <option value="Tiger Shark">Tiger Shark</option>\n' +
                                        '                </select>\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">itemId:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addItemIdOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">price:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addPriceOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n'+
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">stock:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addStockOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '    </form>',
                                    btn:['add','cancel'],
                                    //点击保存
                                    yes:function () {
                                        let item = new Object();
                                        item.categoryId='BIRDS';
                                        item.productId=$("#productIdOfBirdsInSelect").find("option:selected").val();
                                        item.productName=$("#productNameOfBirdsInSelect").find("option:selected").val();
                                        item.itemId=$("#addItemIdOfBirds").val();
                                        item.listPrice=$("#addPriceOfBirds").val();
                                        item.quantity=$("#addStockOfBirds").val();
                                        item.status="1";
                                        //给服务器发送请求
                                        $.ajax({
                                            url:'/product/insertProductInfo',
                                            data:item,
                                            success:function () {
                                                table.reload('JPetStoreTable');
                                                layer.msg('添加成功');
                                            },
                                            error:function () {
                                                layer.msg("添加失败");
                                            }
                                        })

                                    }
                                })
                                form.render();
                                break;
                            //点击批量删除按钮
                            case 'deleteBatch':
                                layer.msg('批量删除');
                                break;
                        };
                    });

                });

                //触发行双击事件
                table.on('rowDouble(test)', function(obj){
                    console.log(obj.tr) //得到当前行元素对象
                    console.log(obj.data) //得到当前行数据
                    $.ajax({
                        type:'get',
                        url:'/product/getItemImage',
                        data:{'itemId': obj.data.itemId},
                        success:function (data) {
                            console.log("获得的图片url为:"+data);
                            layer.open({
                                type:0,
                                title:'item information',
                                content:'<table class="layui-table" >\n' +
                                    '    <tbody>\n' +
                                    '    <tr>\n' +
                                    '        <td colspan="2">BIRDS</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td colspan="2"><img src='+data+'></td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>productId:</td>\n' +
                                    '        <td>'+obj.data.productId+'</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>productName:</td>\n' +
                                    '        <td>'+obj.data.productName+'</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>price:</td>\n' +
                                    '        <td>'+obj.data.price+'</td>\n' +
                                    '    </tr>\n' +
                                    '\n' +
                                    '    <tr>\n' +
                                    '        <td>stock:</td>\n' +
                                    '        <td>'+obj.data.stock+'</td>\n' +
                                    '    </tr>\n' +
                                    '    </tbody>\n' +
                                    '</table>'
                            })
                        }
                    })

                });
            });


        })

    });

    $("#REPTILES").click(function () {
        console.log("点击了BIRDS选项卡");
        layui.use('table', function(){
            var table = layui.table;

            layui.use('form', function(){
                var form = layui.form;
                form.render();

                //渲染表格
                table.render({
                    elem: '#JPetStoreTable'
                    ,height: 600
                    ,weight: 600
                    ,url: '/product/findAllProductInfo' //数据接口
                    ,where: {categoryId:'REPTILES'}
                    ,page: true //开启分页
                    ,skin: 'row'
                    ,even: true
                    ,toolbar: '#toolBar'//表头工具条
                    ,cols: [[ //表头
                        {field: 'selector',type: 'checkbox'}
                        ,{field: 'numbers',type: 'numbers'}
                        ,{field: 'productId', title: 'productId', sort: true}
                        ,{field: 'productName', title: 'productName'}
                        ,{field: 'itemId', title: 'itemId'}
                        ,{field: 'price', title: 'price',sort: true}
                        ,{field: 'stock', title: 'stock',sort: true}
                        //开关,控制货物是否上架   1表示上架,0表示下架
                        ,{field: 'status', title: 'status',templet:function (d) {
                                var state = "";
                                if (d.status == "1") {
                                    state = "<input type='checkbox' value='" + d.id + "' id='status' lay-filter='stat' checked='checked' name='status'  lay-skin='switch' lay-text='上架|下架' >";
                                }
                                else {
                                    state = "<input type='checkbox' value='" + d.id + "' id='status' lay-filter='stat'  name='status'  lay-skin='switch' lay-text='上架|下架' >";

                                }
                                return state;
                            }}
                        ,{fixed: 'right', width:150, align:'center', toolbar: '#operation'} //这里的toolbar值是模板元素的选择器
                    ]]
                    ,done:function (res,curr,count) {
                        console.log(res);
                    }//设置数据格式
                    ,parseData: function(res) { //res 即为原始返回的数据
                        return {
                            "code": 0, //解析接口状态
                            "msg": res.message, //解析提示文本
                            "count": res.total, //解析数据长度
                            "data": res //解析数据列表
                        };
                    }
                });


                //触发行单击事件
                table.on('row(test)', function(obj){
                    //监听表格中的开关事件
                    form.on('switch(stat)', function (data) {//data为1或0
                        console.log(obj.tr) //得到当前行元素对象
                        console.log(obj.data) //得到当前行数据

                        var contexts;
                        var sta;
                        var x = data.elem.checked;//判断开关状态
                        if (x==true) {
                            contexts = "上架";
                            sta='1';
                        } else {
                            contexts = "下架";
                            sta='0';
                        }
                        //自定义弹窗
                        layer.open({
                            content: "你确定要"+contexts+"吗?"
                            , btn: ['确定', '取消']
                            , yes: function (index, layero) {
                                //按钮确定【按钮一】的回调
                                console.log(data.elem);
                                console.log(data.value);
                                data.elem.checked = x;
                                //对商品进行上架或下架处理
                                $.ajax({
                                    type: "get",
                                    url:'/product/changeStatus',
                                    data: {
                                        //上下架的参数
                                        "itemId":obj.data.itemId,
                                        "status":sta
                                    },
                                    success: function (data) {
                                        if (data == 1) {
                                            layer.msg(contexts+'成功',
                                                // 提示的样式
                                                {icon: 1, time: 2000,});
                                            // 数据重载
                                            active.reload();
                                        }
                                    }
                                });
                                form.render();
                                layer.close(index);
                            }
                            , btn2: function (index, layero) {
                                //按钮【按钮二】的回调
                                data.elem.checked = !x;
                                form.render();
                                layer.close(index);
                                //return false 开启该代码可禁止点击该按钮关闭
                            }
                            , cancel: function () {
                                //右上角关闭回调
                                data.elem.checked = !x;
                                form.render();
                                // return false; //开启该代码可禁止点击该按钮关闭
                            }
                        });

                        return false;

                    });
                });



                //触发右侧工具条事件
                table.on('tool(test)', function(obj){
                    var data = obj.data; //获得当前行数据
                    var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
                    var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

                    console.log("当前要删除(编辑)的行为:"+data);

                    if(layEvent === 'delete'){ //删除
                        layer.confirm('真的删除行么', function(index){
                            obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                            layer.close(index);
                            //向服务端发送删除指令
                            $.ajax({
                                type:'get',
                                url: '/product/deleteProductInfo',
                                data: data,
                                success:function () {
                                    layer.msg("删除成功");
                                },
                                error:function () {
                                    layer.msg("删除失败");
                                }
                            })
                        });
                    } else if(layEvent === 'edit'){ //编辑

                        //弹出修改框
                        layer.open({
                            type:0, //layer提供了5种层类型。可传入的值有：0:（信息框，默认）,1:（页面层）,2:（iframe层）,3:（加载层）,4:（tips层）
                            title:'修改产品信息',
                            content:'<form class="layui-form layui-form-pane">' +
                                ' <div class="layui-form-item">\n' +
                                '            <label class="layui-form-label">price:</label>\n' +
                                '            <div class="layui-input-inline">\n' +
                                '                <input type="text" id="priceOfBirds" value='+data.price+' required  lay-verify="required" autocomplete="off" class="layui-input">\n' +
                                '            </div>\n' +
                                '        </div>'+
                                ' <div class="layui-form-item">\n' +
                                '            <label class="layui-form-label">stock:</label>\n' +
                                '            <div class="layui-input-inline">\n' +
                                '                <input type="text" id="stockOfBirds" value='+data.stock+' required  lay-verify="required" autocomplete="off" class="layui-input">\n' +
                                '            </div>\n' +
                                '        </div>'+
                                '</form>'
                            ,btn:['save','cancel']
                            ,yes:function () {

                                var newProductPrice = $('#priceOfBirds').val();
                                var newProductStock = $('#stockOfBirds').val();

                                if (data.price==newProductPrice&&data.stock==newProductStock)
                                {
                                    layer.msg("未做更改");
                                }else {
                                    data.price=newProductPrice;
                                    data.stock=newProductStock;
                                    $.ajax({
                                        type:'get',
                                        url:'/product/updateProductInfo',
                                        data:data,
                                        success:function () {
                                            layer.msg("编辑成功");
                                            //同步更新缓存对应的值
                                            obj.update({
                                                price:newProductPrice,
                                                stock:newProductStock
                                            });
                                        },
                                        error:function () {
                                            layer.msg("编辑失败");
                                        }
                                    })
                                }
                            }
                        })

                    }
                })

                //触发复选框事件
                table.on('checkbox(test)', function(obj){
                    console.log(obj); //当前行的一些常用操作集合
                    console.log(obj.checked); //当前是否选中状态
                    console.log(obj.data); //选中行的相关数据
                    console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
                });

                //触发头部工具栏事件
                table.on('toolbar(test)', function(obj){
                    var checkStatus = table.checkStatus(obj.config.id);
                    layui.use('form', function(){
                        var form = layui.form;
                        form.render();
                        switch(obj.event){
                            //点击添加按钮
                            case 'add':
                                layer.open({
                                    type:0,
                                    title:'新增商品',
                                    //弹出表单
                                    content:'<form class="layui-form layui-form-pane" action="#">\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">productId</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <select id="productIdOfBirdsInSelect" name="productId" lay-verify="required">\n' +
                                        '                    <option value=""></option>\n' +
                                        '                    <option id="RP-LI-02" value="RP-LI-02">RP-LI-02</option>\n' +
                                        '                    <option id="RP-SN-01" value="RP-SN-01">RP-SN-01</option>\n' +
                                        '                </select>\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">productName</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <select id="productNameOfBirdsInSelect" name="productName" lay-verify="required">\n' +
                                        '                    <option value=""></option>\n' +
                                        '                    <option value="Iguana">Iguana</option>\n' +
                                        '                    <option value="Rattlesnake">Rattlesnake</option>\n' +
                                        '                </select>\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">itemId:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addItemIdOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">price:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addPriceOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n'+
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '        <div class="layui-form-item">\n' +
                                        '            <label class="layui-form-label">stock:</label>\n' +
                                        '            <div class="layui-input-inline">\n' +
                                        '                <input type="text" id="addStockOfBirds" required lay-verify="required" autocomplete="off"\n' +
                                        '                       class="layui-input">\n' +
                                        '            </div>\n' +
                                        '        </div>\n' +
                                        '    </form>',
                                    btn:['add','cancel'],
                                    //点击保存
                                    yes:function () {
                                        let item = new Object();
                                        item.categoryId='BIRDS';
                                        item.productId=$("#productIdOfBirdsInSelect").find("option:selected").val();
                                        item.productName=$("#productNameOfBirdsInSelect").find("option:selected").val();
                                        item.itemId=$("#addItemIdOfBirds").val();
                                        item.listPrice=$("#addPriceOfBirds").val();
                                        item.quantity=$("#addStockOfBirds").val();
                                        item.status="1";
                                        //给服务器发送请求
                                        $.ajax({
                                            url:'/product/insertProductInfo',
                                            data:item,
                                            success:function () {
                                                table.reload('JPetStoreTable');
                                                layer.msg('添加成功');
                                            },
                                            error:function () {
                                                layer.msg("添加失败");
                                            }
                                        })

                                    }
                                })
                                form.render();
                                break;
                            //点击批量删除按钮
                            case 'deleteBatch':
                                layer.msg('批量删除');
                                break;
                        };
                    });

                });

                //触发行双击事件
                table.on('rowDouble(test)', function(obj){
                    console.log(obj.tr) //得到当前行元素对象
                    console.log(obj.data) //得到当前行数据
                    $.ajax({
                        type:'get',
                        url:'/product/getItemImage',
                        data:{'itemId': obj.data.itemId},
                        success:function (data) {
                            console.log("获得的图片url为:"+data);
                            layer.open({
                                type:0,
                                title:'item information',
                                content:'<table class="layui-table" >\n' +
                                    '    <tbody>\n' +
                                    '    <tr>\n' +
                                    '        <td colspan="2">BIRDS</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td colspan="2"><img src='+data+'></td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>productId:</td>\n' +
                                    '        <td>'+obj.data.productId+'</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>productName:</td>\n' +
                                    '        <td>'+obj.data.productName+'</td>\n' +
                                    '    </tr>\n' +
                                    '    <tr>\n' +
                                    '        <td>price:</td>\n' +
                                    '        <td>'+obj.data.price+'</td>\n' +
                                    '    </tr>\n' +
                                    '\n' +
                                    '    <tr>\n' +
                                    '        <td>stock:</td>\n' +
                                    '        <td>'+obj.data.stock+'</td>\n' +
                                    '    </tr>\n' +
                                    '    </tbody>\n' +
                                    '</table>'
                            })
                        }
                    })

                });
            });


        })

    });


    //验证码动画
    $('#getCode').click(function () {
        var telephone = $("#telephone").val();
        console.log(telephone);
        if(telephone == '' || telephone.length != 11){
            layer.msg("请输入正确的手机号！");
            return;
        }else{
            $.ajax({
                type: 'get',
                url: '/sendCode',
                data: {
                    telephone : telephone,
                },
                dataType: 'json',
                success: function(data) {
                    if(data){
                        timer();
                    }else{
                        layer.msg("获取验证码失败");
                    }
                },
                error: function(data) {
                    layer.msg('连接超时！');
                },
            });
        }
    })
    var wait = 60;
    //倒计时
    function timer() {
        console.log(wait);
        if(wait == 0){
            $("#getCode").text("获取验证码");
            $("#getCode").attr("disabled","false");
            $("#getCode").css("cursor", "pointer");
            wait = 60;
        }else{
            $("#getCode").attr("disabled","true");
            $("#getCode").css("cursor", "not-allowed");
            $("#getCode").text(wait + "秒后重发");
            wait--;
            setTimeout(function() {timer()}, 1000);
        }
    }


})
