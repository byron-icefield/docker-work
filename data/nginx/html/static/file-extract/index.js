$(function () {
    layui.use(['upload', 'element', 'layer', 'laytpl'], function () {
        var $ = layui.jquery
            , upload = layui.upload
            , element = layui.element
            , laytpl = layui.laytpl
            , layer = layui.layer;


        $.ajax({
            type: "get",
            url: '/classify/api/v1/file/extract/supported',
            success: function (data) {
                if (!data.success) {
                    layer.msg('获取数据出错');
                } else {
                    $('#support-file').html(data.data.join('  '));
                }
            },
            error: function (e) {
                layer.msg('查询出错了');
            }
        });

        //选完文件后不自动上传
        upload.render({
            elem: '#file-choose'
            , url: '/classify/api/v1/file/extract/do' //此处配置你自己的上传接口即可
            , data: {
                mode: function () {
                    return $("input[name='mode']:checked").val();
                }
            }
            , auto: false
            , accept: "file"
            // kb
            , size: 102400
            //,multiple: true
            , bindAction: '#file-upload'
            , done: function (res) {
                if (!res.success) {
                    layer.msg(res.errorMessage);
                    return;
                }
                console.log(res);

                if (res.data.additionalInfo){
                    $("#additional-info").html(res.data.additionalInfo);
                } else {
                    $("#additional-info").html("解析结果如下");
                }

                laytpl($('#extract-tpl').html()).render(res.data.items, function (html) {
                    console.log(html)
                    $("#extract-view").html(html);
                    // 渲染一下
                    element.render();
                });
            }
            , error: function () {
                layer.msg('上传出错');
            }
        });
    });
});