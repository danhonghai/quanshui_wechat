var Meter = (function () {

    var options = {

        styles: {
            sAngle: 0.83,
            eAngle: 2.17,
            area: {
                radius: 5,
                colors: { 
                    '0': '#0090e9', 
                    '1': '#0090e9'
                },
                lineWidth: 1,
                scaleLength: 9,
                scaleWidth: 0.2,
                lineColor: '#0090e9'
            },
            range: {
                color: '#f00',
                width: 2,
                arrow: {
                    height: 15,
                    radius: 4
                } 
            },
            value: {
                margin: -20,
                color: '#0090e9',
                font: 'bold 24px Microsoft YaHei'
            },
            title: {
                margin: -0,
                color: '#999',
                font: 'bold 12px Microsoft YaHei'
            },
            subTitle: {
                margin: 50,
                color: '#999',
                font: '12px Microsoft YaHei'
            },
            label: {
                radius: 20,
                color: '#f45e67',
                background: '#69bbff',
                font: '12px Microsoft YaHei'
            },
            inner: {
                radius: 60,
                color: '#f00',
                dashedWidth: 3
            }
        }
    };

    var element, 
        context, 
        styles,
        sAngle,
        eAngle,
        areaStyle,
        rangeStyle,
        valueStyle,
        titleStyle,
        subTitleStyle,
        labelStyle,
        innerStyle;

    var extend = function(obj1, obj2){
        for(var k in obj2) {
            if(obj1.hasOwnProperty(k) && typeof obj1[k] == 'object') {
                extend(obj1[k], obj2[k]);
            } else {
                obj1[k] = obj2[k];
            }
        }
    }

    var calcLocation = function(r, end){

        return {
            x: options.centerPoint.x + r * Math.cos(Math.PI * end),
            y: options.centerPoint.y + r * Math.sin(Math.PI * end)
        };
    }

    var calcValueRange = function(value){
        var data = options.data.area,
            index = data.length - 1;

        for (var i = index; i >= 0; i--) {
            if(value >= data[i].min && value < data[i].max){
                index = i;
            }
        };
        var r = (eAngle - sAngle)/data.length,
            s = r * index + sAngle,
            e = r * (index + 1) + sAngle,
            o = data[index];

        return {
            range: (value - o.min)/(o.max - o.min) * (e - s) + s,
            index: index
        };
    }

    var drawCircle = function(opts, flag) {
        var x = opts.x || options.centerPoint.x,
            y = opts.y || options.centerPoint.y,
            s = opts.start || 0,
            e = opts.end || 2;

        context.beginPath();
        context.moveTo(x, y);

        switch(flag){
            case 1: 
                context.setLineDash && context.setLineDash([innerStyle.dashedWidth]);
            case 2:
                context.arc(x, y, opts.r, Math.PI*s, Math.PI*e);
                context.closePath();
                context.strokeStyle = opts.style;
                context.stroke();
                break;
            default:
                context.arc(x, y, opts.r, Math.PI*s, Math.PI*e);
                context.closePath();
                context.fillStyle = opts.style;
                context.fill();
                break;
        }      
    }

    var drawArea = function(){
        var grad  = context.createLinearGradient(0, 0, options.radius*2, 0);
        for(var k in areaStyle.colors) {
            grad.addColorStop(k, areaStyle.colors[k]);
        }

        drawCircle({
            r: options.radius,
            start: sAngle,
            end: eAngle,
            style: grad
        });

        drawCircle({
            r: options.radius - areaStyle.radius,
            style: '#fff'
        });
    }

    var drawValueRange = function(valueRange){

        var r = options.radius - areaStyle.radius;

        drawCircle({
            r: r,
            start: sAngle,
            end: valueRange.range,
            style: labelStyle.background
        });

        drawCircle({
            r: r - labelStyle.radius,
            start: sAngle,
            end: valueRange.range,
            style: rangeStyle.color
        });

        drawCircle({
            r: r - labelStyle.radius - rangeStyle.width,
            style: '#fff'
        });
    }

    var fillText = function(opts){
        context.font = opts.font; 
        context.fillStyle = opts.color;
        context.textAlign = opts.align || 'center';
        context.textBaseline = opts.vertical || 'middle';  
        context.moveTo(opts.x, opts.y);  
        context.fillText(opts.text, opts.x, opts.y); 
    }

    var drawInnerContent = function(valueRange, value){
        drawCircle({
            r: innerStyle.radius,
            start: sAngle,
            end: eAngle,
            style: innerStyle.color
        }, 1);

        drawCircle({
            r: innerStyle.radius - 1,
            style: '#fff'
        });

        var data = options.data;
        
        fillText({
            font: valueStyle.font,
            color: valueStyle.color,
            text: value,
            x: options.radius,
            y: options.radius + valueStyle.margin
        });

        fillText({
            font: titleStyle.font,
            color: titleStyle.color,
            text: data.title.replace('{t}', data.area[valueRange.index].text).replace('{v}', value),
            x: options.radius,
            y: options.radius + titleStyle.margin
        });

        fillText({
            font: subTitleStyle.font,
            color: subTitleStyle.color,
            text: data.subTitle,
            x: options.radius,
            y: options.radius + subTitleStyle.margin
        });
    }

    var drawArrow = function(valueRange){
        var r = options.radius - areaStyle.radius - labelStyle.radius,
            loc = calcLocation(r, valueRange.range),
            x = loc.x - 1, 
            y = loc.y + 0.5;

        drawCircle({
            x: x,
            y: y,
            r: rangeStyle.arrow.radius,
            style: rangeStyle.color
        });
        
        var a = calcLocation(r - rangeStyle.arrow.height, valueRange.range),
            b = calcLocation(r, valueRange.range - 0.01),
            c = calcLocation(r, valueRange.range + 0.01);

        context.beginPath();
        context.moveTo(a.x - 1, a.y + 0.5);
        context.lineTo(b.x - 1, b.y + 0.5);
        context.lineTo(c.x - 1, c.y + 0.5);
        context.closePath();
        context.fillStyle = rangeStyle.color;
        context.fill();

        drawCircle({
            x: x,
            y: y,
            r: rangeStyle.arrow.radius - rangeStyle.width,
            style: '#fff'
        });
    }

    var drawLine = function(line) {
        context.beginPath();
        context.moveTo(line.start.x, line.start.y);
        context.lineTo(line.end.x, line.end.y);
        context.closePath();
        context.strokeStyle = line.style;
        context.lineWidth = line.width || 1;
        context.stroke();
    }

    var drawTickMarks = function(){
        var scaleLength = areaStyle.scaleLength,
            data = options.data.area,
            len = scaleLength * data.length,
            range = (eAngle - sAngle)/len;

        for(var j = 1; j < len; j++){
            drawLine({
                start: calcLocation(options.radius, sAngle + range * j),
                end: calcLocation(options.radius - areaStyle.radius, sAngle + range * j),
                style: areaStyle.lineColor,
                width: j % scaleLength == 0 ? areaStyle.lineWidth: areaStyle.scaleWidth
            });
        }

        var lblArr = [];
        for(var i = 0; i < data.length; i++){
            var o = data[i];
            // 如果不需兼容IE9以下则不用join
            if(lblArr.join('').indexOf(o.min) == -1) {
                lblArr.push(o.min);
            }
            lblArr.push(o.text);
            lblArr.push(o.max);

        }
        
        var lblLen = lblArr.length - 1,
            lblRange = (eAngle - sAngle)/lblLen,
            lblOpt = labelStyle,
            lblR = options.radius - areaStyle.radius - lblOpt.radius/2;

        for(var k = 0; k <= lblLen; k++){
            var loc = calcLocation(lblR, sAngle + lblRange * k);
            lblOpt.x = loc.x;
            lblOpt.y = loc.y;
            lblOpt.text = lblArr[k];
            fillText(lblOpt);
        }
        
    }

    var drawing = function(w, h) {
        var value = options.data.value,
            valueTemp = options.data.area[0].min;

        var timer = setInterval(function(){
            context.clearRect(0, 0, w, h);
            context.fillStyle = "#fff";
            context.fillRect(0, 0, w, h);

            valueTemp = valueTemp + 10 > value ? value: valueTemp + 10;
            var valueRange = calcValueRange(valueTemp);

            drawArea();
            drawValueRange(valueRange);
            drawInnerContent(valueRange, valueTemp);
            drawArrow(valueRange);
            drawTickMarks();

            if(valueTemp === value) {
                clearInterval(timer);
            }
        }, 10);
    }

    var exports = {};

    exports.setOptions = function(opts){
        extend(options, opts);

        styles = options.styles;
        sAngle = styles.sAngle;
        eAngle = styles.eAngle;
        areaStyle = styles.area;
        rangeStyle = styles.range;
        valueStyle = styles.value;
        titleStyle = styles.title;
        subTitleStyle = styles.subTitle;
        labelStyle = styles.label;
        innerStyle = styles.inner;

        element = typeof options.element == 'string' ? document.getElementById(options.element) : options.element;
        context = element.getContext('2d');
        return exports;
    };

    exports.init = function(){
        drawing(element.offsetWidth, element.offsetHeight);
        return exports;
    }

    return exports;
})();
