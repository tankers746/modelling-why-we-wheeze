/*! Copyright: quackingfrogs.com 2014 */$(document).ready(function(){function c(a){return 28/Math.pow(a,4)}function d(a){return a*t/v+u}function e(a){return(a-u)*v/t}function f(a){return a*t/v-u}function g(a){return a-s/2}function h(a){return a+s/2}function i(a){return t-a}function j(a){return i(a+s/2)}function k(a,b){var c=-a/2;$(b).animate({width:a+"px",height:a+"px","margin-top":c+"px","margin-left":c+"px"},{queue:!1,duration:q,easing:"linear"})}function l(a,b){$(b).animate({"margin-top":a+"px"},{queue:!1,duration:q,easing:"linear"})}function m(){x=-$("#slider1").val()/o,y=-$("#slider2").val()/o,z=-$("#slider3").val()/o,a=1,b=1,n&&(a=$("#slider4").val()/o,b=$("#slider5").val()/o),r4=A*(1-a*x),area4=Math.PI*Math.pow(r4,2),area34=B,area23=C*(1+b*y),area12=D*(1+b*z),area3=area4-area34,area2=area3-area23,area1=area2-area12,0>area2&&(area2=0),0>area1&&(area1=0),r3=Math.sqrt(area3/Math.PI),r2=Math.sqrt(area2/Math.PI),r1=Math.sqrt(area1/Math.PI),k(2*r4*p,"#circ4"),k(2*r3*p,"#circ3"),k(2*r2*p,"#circ2"),k(2*r1*p,"#circ1"),l(130*(1-x/.2)+7,"#marker1"),l(130*(1-y)+7,"#marker2"),l(130*(1-z/5)+7,"#marker3"),l(130*a+7,"#marker4"),l(130*b+7,"#marker5"),x=d(r1),mx=g(x)+w,$("#marker").animate({marginLeft:mx+"px"},{queue:!1,duration:q,easing:"linear",step:function(a){x=h(a-w),r=e(x),ar=c(r),y=f(ar),my=j(y),disp=-s/2>my?"none":"block",$(this).css({"margin-top":my+"px",display:disp})}})}var n=!1,o=1e3,p=13.75,q=400,s=10,t=200,u=10,v=7,w=80,A=10,B=19*Math.PI,C=32*Math.PI,D=4.1*Math.PI,E=$("#graphCanvas")[0],F=E.getContext("2d");F.beginPath(),F.moveTo(0,0);for(var G=1;t>=G;G++)x=G+u,r=e(x),ar=c(r),y=f(ar),iy=i(y),F.lineTo(x,iy);F.lineWidth=3,F.stroke(),$("#slider1").noUiSlider({range:[-200,0],start:0,handles:1,slide:m,orientation:"vertical"}),$("#slider2").noUiSlider({range:[-1e3,0],start:0,handles:1,slide:m,orientation:"vertical"}),$("#slider3").noUiSlider({range:[-5e3,0],start:0,handles:1,slide:m,orientation:"vertical"}),n&&($("#slider4").noUiSlider({range:[0,1e3],start:1e3,handles:1,slide:m,orientation:"vertical"}),$("#slider5").noUiSlider({range:[0,1e3],start:1e3,handles:1,slide:m,orientation:"vertical"})),$("#slider1").change(m),$("#slider2").change(m),$("#slider3").change(m),n&&($("#slider4").change(m),$("#slider5").change(m)),m()});