var gl;
var shaderProgramSquare;

//var thetaUniform;
var MUniform;
var M;
var theta;

var MsUniform;
var s;
var Ms;
var sflip;

var MtUniform;
var Mt;
var tx;
var ty;

var flag;
var flip;

var mousePositionUniform;
var mouseX;
var mouseY;

var colorUniform;
var r, g, b;

function init() {
    flag = 1;
    flip = 1;
    // Set up the canvas
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL is not available" ); }
    
    // Set up the viewport
    gl.viewport( 0, 0, 512, 512 );   // x, y, width, height
    
    
    // Set up the background color
    gl.clearColor( 1.0, 0.0, 0.0, 1.0 );
    
    
    shaderProgramSquare = initShaders( gl, "vertex-shader-square",
                                      "fragment-shader-square" );
    gl.useProgram( shaderProgramSquare );

    theta = .0;
    M = [Math.cos(theta), 
        -Math.sin(theta), 
        Math.sin(theta), 
        Math.cos(theta)];
    MUniform = gl.getUniformLocation(shaderProgramSquare, "M");
    gl.uniformMatrix2fv(MUniform,false, M);

    s = 1.0;
    sflip = 1;
    Ms = [s, 0, 0, 0, s, 0, 0, 0, 1.0];
    MsUniform = gl.getUniformLocation(shaderProgramSquare, "Ms");
    gl.uniformMatrix3fv(MUniform,false, Ms);

    tx = .0;
    ty = .0;
    Mt = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, tx, ty, 1.0];
    MtUniform = gl.getUniformLocation(shaderProgramSquare, "Mt");
    gl.uniformMatrix3fv(MtUniform,false, Mt);

    mouseX = .0;
    mouseY = .0;
    mousePositionUniform = gl.getUniformLocation(shaderProgramSquare, "mousePosition");
    gl.uniform2f(mousePositionUniform, mouseX, mouseY);

    r = 0.0;
    g = 0.0;
    b = 0.0;
    colorUniform = gl.getUniformLocation(shaderProgramSquare, "color");
    gl.uniform4f(colorUniform, r, g, b, 1.0);
    
    
    setupSquare();
    
    drawSquare();
}

function setupSquare() {
    
    // Enter array set up code here
    var p0 = vec2( .2, .2 );
    var p1 = vec2( -.2, .2 );
    var p2 = vec2( -.2, -.2 );
    var p3 = vec2( .2, -.2 );
    var arrayOfPoints = [p0, p1, p2, p3];
    
    // Create a buffer on the graphics card,
    // and send array to the buffer for use
    // in the shaders
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(arrayOfPoints), gl.STATIC_DRAW );
    
    // Create a pointer that iterates over the
    // array of points in the shader code
    var myPositionAttribute = gl.getAttribLocation( shaderProgramSquare, "myPosition" );
    gl.vertexAttribPointer( myPositionAttribute, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( myPositionAttribute );    
}

function drawSquare() {
    
    // Force the WebGL context to clear the color buffer
    gl.clear( gl.COLOR_BUFFER_BIT );

    theta += .01 * flag;

    M = [Math.cos(theta), 
        -Math.sin(theta), 
        Math.sin(theta), 
        Math.cos(theta)];
    gl.uniformMatrix2fv(MUniform,false, M);

    b = b + (0.01 * flip);
    if(b >= 1.0) {
        flip = -flip;
    }
    if(b <= 0) {
        flip = -flip;
    }

    s = s + (0.01 * sflip * flag);
    if(s >= 3.0) {
        sflip = -1;
    }
    if(s <= .5) {
        sflip = 1;
    }
    Ms = [s, 0, 0, 0, s, 0, 0, 0, 1.0];
    gl.uniformMatrix3fv(MsUniform,false, Ms);

    tx += 0.001 * flag;
    ty += 0.001 * flag;

    Mt = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, tx, ty, 1.0];
    gl.uniformMatrix3fv(MtUniform,false, Mt);


    gl.uniform4f(colorUniform, r, g, b, 1.0);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    requestAnimFrame(drawSquare);
    
}

function moveShape(event) {
    mouseX = 2.0*event.clientX/512.0 - 1.0;
    mouseY = -(2.0*event.clientY/512.0 - 1.0);

    gl.uniform2f(mousePositionUniform, mouseX, mouseY);
}

function toggleAnim() {
    flag = 1 - flag;
}

function moveShapeKeys(event) {

    var theKeyCode = event.keyCode;
    //console.log(theKeyCode);
    var nudge = 0.1;

    if(theKeyCode == 65) {
        mouseX -= nudge;
    } else if (theKeyCode == 68) {
        mouseX += nudge;
    } else if (theKeyCode == 83) {
        mouseY -= nudge;
    } else if (theKeyCode == 87) {
        mouseY += nudge;
    }

    gl.uniform2f(mousePositionUniform, mouseX, mouseY);
}
