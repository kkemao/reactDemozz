
    

$(function(){
    let datas = [];
    let res = [
        {
            id:1,
            name:'李四',
            imgUrl:'../fakeData/1-3.png',
            positiveUrl:'../fakeData/1-1.jpg',
            negativeUrl:'../fakeData/1-2.jpg',
            cardId:"515423191411026999",
            IllegalTime:'2018-7-12',
            Illegaldestination:'深圳',
            Illegal:'8次'
        },
        {
            id:2,
            name:'王五',
            imgUrl:'../fakeData/2-3.png',
            positiveUrl:'../fakeData/2-1.jpg',
            negativeUrl:'../fakeData/2-2.jpg',
            cardId:"515423191411026544",
            IllegalTime:'2018-9-8',
            Illegaldestination:'深圳',
            Illegal:'3次'
        },
        {
            id:3,
            imgUrl:'../fakeData/3-3.png',
            positiveUrl:'../fakeData/2-1.jpg',
            negativeUrl:'../fakeData/2-2.jpg',
            name:'风清扬',
            cardId:"815423195411026555",
            IllegalTime:'2016-11-12',
            Illegaldestination:'深圳',
            Illegal:'11次'
        },
        {
            id:4,
            imgUrl:'../fakeData/4-3.png',
            positiveUrl:'../fakeData/4-1.jpg',
            negativeUrl:'../fakeData/4-2.jpg',
            name:'张飞',
            cardId:"2154231954110238457",
            IllegalTime:'2018-5-12',
            Illegaldestination:'深圳',
            Illegal:'32次'
        },
        {
            id:5,
            name:'沈向阳',
            imgUrl:'../fakeData/5-3.png',
            positiveUrl:'../fakeData/5-1.jpg',
            negativeUrl:'../fakeData/5-2.jpg',
            cardId:"215423195411128152",
            IllegalTime:'2011-2-12',
            Illegaldestination:'深圳',
            Illegal:'12次'
        },
        {
            id:8,
            name:'关羽',
            imgUrl:'../fakeData/6-3.png',
            positiveUrl:'../fakeData/6-1.jpg',
            negativeUrl:'../fakeData/6-2.jpg',
            cardId:"215423195411124523",
            IllegalTime:'2018-11-12',
            Illegaldestination:'深圳',
            Illegal:'6次'
        },
        {
            id:9,
            name:'周星驰',
            imgUrl:'../fakeData/7-3.png',
            positiveUrl:'../fakeData/7-1.jpg',
            negativeUrl:'../fakeData/7-2.jpg',
            cardId:"515423195411129067",
            IllegalTime:'2016-4-2',
            Illegaldestination:'深圳',
            Illegal:'7次'
        },
        {
            id:10,
            name:'爱迪生',
            imgUrl:'../fakeData/8-3.png',
            positiveUrl:'../fakeData/8-1.jpg',
            negativeUrl:'../fakeData/8-2.jpg',
            cardId:"315423195411120890",
            IllegalTime:'2018-6-15',
            Illegaldestination:'深圳',
            Illegal:'8次'
        },
        {
            id:11,
            name:'Yui',
            imgUrl:'../fakeData/9-3.png',
            positiveUrl:'../fakeData/9-1.jpg',
            negativeUrl:'../fakeData/9-2.jpg',
            cardId:"815423195411121234",
            IllegalTime:'2018-3-7',
            Illegaldestination:'深圳',
            Illegal:'22次'
        },
        {
            id:12,
            name:'刘德华',
            imgUrl:'../fakeData/10-3.png',
            positiveUrl:'../fakeData/10-1.jpg',
            negativeUrl:'../fakeData/10-2.jpg',
            cardId:"516423195411126541",
            IllegalTime:'2018-11-12',
            Illegaldestination:'深圳',
            Illegal:'6次'
        }
    ];
    function renderItem(data){
        var itemStr = '';
        data.forEach((item,i) => {
            let thisId = item.id;
            itemStr = '<div class="items" data-id='+thisId+' data-positive='+item.positiveUrl+' data-negetive='+item.negativeUrl+' data-Illegal='+item.Illegal+'>'+
                    '<span class="imgBox">'+
                        '<img src='+item.positiveUrl+' alt="">'+
                    '</span>'+
                    '<hr>'+
                    '<div class="itemContentBox">'+
                            '<p>'+
                            '<span>姓名</span>'+
                            '<span class="name">'+item.name+'</span>'+
                            '</p>'+
                            '<p>'+
                            '<span>身份证号</span>'+
                            '<span class="cardId">'+item.cardId+'</span>'+
                            '</p>'+
                            '<p>'+
                            '<span>违法时间</span>'+
                            '<span class="illegalTime">'+item.IllegalTime+'</span>'+
                            '</p>'+
                            '<p>'+
                            '<span>违法地点</span>'+
                            '<span class="illegalPlace">'+item.Illegaldestination+'</span>'+
                        '</p>'+
                    '</div>'+
                '</div>'
                ;
            datas.push(itemStr)
        });
    }
    renderItem(res)
    layui.use(['laypage','layer'],function(){
        let laypage = layui.laypage
        let layer = layui.layer;
        var data = [];
        laypage.render({
            elem: 'layerPages',
            count: datas.length,
            limit:8,
            theme:'#172F6B',
            jump: function(obj){
              //模拟渲染
                document.getElementById('content').innerHTML = function(){
                let arr = [];
                let thisData = datas.concat().splice(obj.curr*obj.limit - obj.limit, obj.limit);
                    layui.each(thisData, function(index, item){
                        arr.push(item);
                    });
                    return arr.join('');
                }();
            }
          });
    })
    
    $('#content').on('click','.items',function(){
        // let box = $('#layerpop .layerpopContent');
        
        $('#layerpop .layerpopContent .layerpopContentLeft > img').attr('src',$(this).attr('data-positive'))
        $('#layerpop .layerpopContent .positive > img').attr('src',$(this).attr('data-positive'))
        $('#layerpop .layerpopContent .negetive > img').attr('src',$(this).attr('data-negetive'))
        $('#layerpop .layerpopContent .personName').text($(this).find('.name').html())
        $('#layerpop .layerpopContent .personCardId').text($(this).find('.cardId').html())
        $('#layerpop .layerpopContent .illegalTime').text($(this).find('.illegalTime').html())
        $('#layerpop .layerpopContent .illegalNumber').text($(this).attr('data-Illegal'))
        
        $('#maskLayer').show();
        $('#layerpop').show()
    })
    $('#layerpop').on('click','.closeIcon',function(){
        $('#maskLayer').hide();
        $('#layerpop').hide()
    })
    $('.btn').on('click',function(){
        let obj = {},currentObj = {};
        let content = trim($('#searchForm').serialize());
        content.split('&').forEach(function(d, i){
            obj[d.split('=')[0]] = decodeURIComponent(d.split('=')[1]);
        });
        console.log(content)
        console.log(obj)
        currentObj = res.filter((d)=>{
            if(d.name === obj.name && d.cardId === obj.cardId){
                return d
            }
        });
        console.log(obj.name)
        if(obj['name']==''){
            swal('', '搜索姓名格式不正确!', 'warning')
            return
        }
        if( !isCardNo(obj['cardId'])) {
            console.log('执行')
            if(obj['cardId'] == ''){
                swal('', '身份证号码不能为空!', 'warning')
                return
            }
        }
        if(!currentObj[0]) {
            swal('', '搜索名称未匹配到有效信息!', 'error')
            return 
        }
        $('#layerpop .layerpopContentRightContens .personName').text(currentObj[0]['name'])
        $('#layerpop .layerpopContentRightContens .personCardId').text(currentObj[0]['cardId'])
        $('#maskLayer').show();
        $('#layerpop').show()
    })

// 验证身份证 
function isCardNo(card) {  
    var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
    return pattern.test(card); 
 } 
 // 删除多余空格
function trim(str){    
    return str.replace(/\s|\++/g, "");   
}
})