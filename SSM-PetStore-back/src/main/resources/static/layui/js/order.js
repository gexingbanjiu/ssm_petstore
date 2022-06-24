
$(function () {

    layui.use('element', function () {
        var element = layui.element;
        //一些事件触发
        element.on('tab(demo)', function (data) {
            console.log(data);
        });
    });


//订单处理
    $("#ORDER").click(function () {
        console.log("点击了订单选项卡");
        layui.use('table', function () {
            var table = layui.table;

            //订单实例
            table.render({
                elem: '#JPetStoreTable'
                , height: 600
                , weight: 600
                ,toolbar: '#toolbarOrder'
                , url: '/order/showAllOrder'
                , cols: [[
                    {type: 'checkbox', fixed: 'left'}
                    , {field: 'orderid', title: 'orderid', event: 'orderid-click'}
                    , {field: 'userid', title: "userid"}
                    , {field: 'totalprice', title: '总价格'}
                    , {
                        field: 'orderdate', title: '时间'}
                    , {field: 'shipaddr1', title: 'shipaddr1', edit: 'text',}
                    , {field: 'shipaddr2', title: 'shipaddr2',  edit: 'text',}
                    , {field: 'shipcity', title: 'shipcity',  edit: 'text',}
                    ,{field: 'delivery',title: '发货状态',}
                    , {align: 'center', title: '操作', toolbar: "#Operationorder",width:240}
                ]]
                , page: true//开启分页
                , success(data) {
                    console.log(data);
                }
                ,
                parseData: function (res) { //res 即为原始返回的数据
                    return {
                        "code": 0, //解析接口状态
                        "msg": res.message, //解析提示文本
                        "count": res.total, //解析数据长度
                        "data": res //解析数据列表
                    };
                }

            })

            //搜索按钮的监听事件
            $('body').on('click','#searchOrderBtn',function(){//解决了搜索键只能点击一次的bug，#搜索btn的id
                var type = $(this).data('type');
                active[type] ? active[type].call(this) : '';//input的data-type
            });
            // 点击获取数据
            var  active = {
                getInfo: function () {
                    var orderid=$('#select_orderid').val();//#input输入框的id
                    if (orderid) {
                        var index = layer.msg('查询中，请稍候...',{icon: 16,time:false,shade:0});//等待框
                        setTimeout(function(){

                            table.reload('JPetStoreTable', { //表格的id
                                url:'/order/searchOrderid',//重载url，数据接口
                                where: {
                                    'orderid':$.trim(orderid)
                                },
                                parseData: function (res) { //res 即为原始返回的数据
                                    return {
                                        "code": 0, //解析接口状态
                                        "msg": res.message, //解析提示文本
                                        "count": res.total, //解析数据长度
                                        "data": res //解析数据列表
                                    };
                                }
                            });

                            layer.close(index);//关闭等待框
                        },800);
                    } else {
                        layer.msg("请输入编号");
                    }
                },
            };

            //触发复选框事件
            table.on('checkbox(test)', function (obj) {
                console.log(obj); //当前行的一些常用操作集合
                console.log(obj.checked); //当前是否选中状态
                console.log(obj.data); //选中行的相关数据
                console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
            });

            table.on('tool(test)', function (obj) {
                if (obj.event === 'orderid-click') {
                    console.log(obj.data.orderid);
                    console.log("点击了具体订单");
                    layui.use('table', function () {
                        var table = layui.table;
                        var orderid = obj.data.orderid;
                        table.render({
                            elem: '#JPetStoreTable'
                            , height: 600
                            , weight: 600
                            , where: {orderid}
                            , url: '/showLineItems'
                            , cols: [[
                                {field: 'itemid', title: 'itemid', width: 150, sort: true}
                                , {field: 'quantity', title: '数量', width: 150}
                                , {field: 'unitprice', title: '单价', width: 150}
                                , {field: 'totalprice', title: '该商品总价', width: 150}
                            ]]
                            , page: true
                            , success(data) {
                                console.log(data);

                            },
                            parseData: function (res) { //res 即为原始返回的数据
                                return {
                                    "code": 0, //解析接口状态
                                    "msg": res.message, //解析提示文本
                                    "count": res.total, //解析数据长度
                                    "data": res //解析数据列表
                                };
                            }
                        });


                        //触发复选框事件
                        table.on('checkbox(test)', function (obj) {
                            console.log(obj); //当前行的一些常用操作集合
                            console.log(obj.checked); //当前是否选中状态
                            console.log(obj.data); //选中行的相关数据
                            console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
                        });
                    })
                } else if (obj.event === 'delete') {
                    var data = obj.data;
                    console.log("x");
                    $.ajax({
                        type: 'get',
                        url: '/order/deleteOrder',
                        data: data,
                        success: function () {
                            layer.msg("删除成功");
                        },
                        error: function () {
                            layer.msg("删除失败");
                        }
                    })
                    obj.del();
                } else if (obj.event === 'edit') {
                    console.log("y");
                    var datas = obj.data;
                    var address = datas.orderid + "," + datas.shipaddr1 + ',' + datas.shipaddr2 + ',' + datas.shipcity

                    $.ajax({
                        url: '/order/updateOrder',
                        data: {address},
                        success: function () {
                            layer.msg('修改成功');
                        },
                        error: function () {
                            layer.msg("修改失败");
                        }
                    })


                }
                else if(obj.event ==='sendorder'&&obj.data.delivery=='否'){
                    var datasd=obj.data;
                    var orderid=datasd.orderid;

                    $.ajax({
                        url:'/order/updateDelivery',
                        data:{orderid},
                        success: function () {
                            layer.msg('发货成功');
                            obj.update({
                                delivery : '是'
                            })
                        },
                        error: function () {
                            layer.msg("发货失败");
                        }
                    })

                }
            })


        })
    })
})