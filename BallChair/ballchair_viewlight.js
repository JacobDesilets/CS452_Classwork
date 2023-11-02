// Name:

var gl;
var numVertices;
var numTriangles;

function initGL(){
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.enable(gl.DEPTH_TEST);
    gl.viewport( 0, 0, 512, 512 );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    var myShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( myShaderProgram );

    
    numVertices = 506;
    numTriangles = 976;
    vertices = getVertices(); // vertices and faces are defined in object.js
    indexList = getFaces();
    
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);
    
    var verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var vertexPosition = gl.getAttribLocation(myShaderProgram,"vertexPosition");
    gl.vertexAttribPointer( vertexPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexPosition );
    
    // var normalsBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
        
    // var vertexNormal = gl.getAttribLocation(myShaderProgram,"vertexNormal");
    // gl.vertexAttribPointer( vertexNormal, 4, gl.FLOAT, false, 0, 0 );
    // gl.enableVertexAttribArray( vertexNormal );
    
    // console.log(vertexPosition);
    // console.log(vertexNormal);
    
    // WORK ON VIEWING AND LIGHTING IN TWO ITERATIONS
    // In the first iteration, do Steps 1 and 2 (i.e., do the Viewing portion)
    // and try to determine if you can see a silhouette (i.e., a filled outline)
    // of the chair. You will not see any inner detail, but you will at least know
    // that the chair is within the viewport. Make sure while doing this step
    // to apply the modelview and projection matrices in the vertex shader
    
    // In the second iteration, do Steps 3.1 (normal calculation and light setup), 3.2 (vertex
    // shader calculations for lighting, and steps 3.3 (fragment shader calculations
    // for lighting) so you can see the inner detail of the chair
    
    // FOLLOWING LINES IN STEPS 1 AND 2 NEED CODE FOR EACH COMMENT
    
    
    // Step 1: Position the camera using the look at method
    
    // Define eye (use vec3 in MV.js)

    let e = vec3(40.0, 80.0, 120.0);
    
    // Define at point (use vec3 in MV.js)

    let a = vec3(0.0, 0.0, 0.0);
    
    // Define vup vector (use vec3 in MV.js)

    let vup = vec3(0.0, 1.0, 0.0);
    
    // Obtain n (use subtract and normalize in MV.js)

    let d = subtract(e, a);
    let n = normalize(d);
    
    // Obtain u (use cross and normalize in MV.js)

    let k = cross(vup, n);
    let u = normalize(k);
    
    // Obtain v (use cross and normalize in MV.js)

    let l = cross(n, u);
    let v = normalize(l);
    
    // Set up Model-View matrix M and send M as uniform to shader
    let M = [u[0],
    v[0],
    n[0],
    0.0,
    u[1],
    v[1],
    n[1],
    0.0,
    u[2],
    v[2],
    n[2],
    0.0,
    -dot(e, u),
    -dot(e, v),
    -dot(e, n),
    1.0];
     
    // Step 2: Set up orthographic and perspective projections
    
    // Define left plane
    let left = -50.0;
    
    // Define right plane
    let right = 50.0;
    
    // Define top plane
    let top_ = 50.0;
    
    // Define bottom plane
    let bottom = -50.0;
    
    // Define near plane
    let near = 144.22 - 50.0;
    
    // Define far plane
    let far = 144.22 + 50;
    
    // Set up orthographic projection matrix P_orth using above planes
    let P_orth = [
        2.0/(right-left),
        0.0,
        0.0,
        0.0,
        0.0,
        2.0/(top_-bottom),
        0.0,
        0.0,
        0.0,
        0.0,
        -2.0/(far-near),
        0.0,
        -(left+right)/(right-left),
        -(top_+bottom)/(top_-bottom),
        -(far+near)/(far-near),
        1.0
    ];
    
    // Set up perspective projection matrix P_persp using above planes
    
    let P_persp = [
        2.0*near/(right-left),
        0.0,
        0.0,
        0.0,
        0.0,
        2.0*near/(top_-bottom),
        0.0,
        0.0,
        (right+left)/(right-left),
        (top_+bottom)/(top_-bottom),
        -(far+near)/(far-near),
        -1.0,
        0.0,
        0.0,
        -2.0*far*near/(far-near),
        0.0
    ];

    let modelviewLocation = gl.getUniformLocation(myShaderProgram, "modelview");
    let projectionLocation = gl.getUniformLocation(myShaderProgram, "projection");

    gl.uniformMatrix4fv(modelviewLocation, false, M);
    gl.uniformMatrix4fv(projectionLocation, false, P_persp);

    // Use a flag to determine which matrix to send as uniform to shader
    // flag value should be changed by a button that switches between
    // orthographic and perspective projections
    
    
    
    // Step 3.1: Normals for lighting calculations
    
    // Create face normals using faces and vertices by calling getFaceNormals
    var faceNormals = getFaceNormals( vertices, indexList, numTriangles );
    
    // Create vertex normals using faces, vertices, and face normals
    // by calling getVertexNormals
    var vertexNormals = getVertexNormals( vertices, indexList, faceNormals, numVertices, numTriangles );
    
    // Following code sets up the normals buffer (NOTE: THERE IS AN INTENTIONAL
    // MISTAKE HERE, YOU WILL NEED TO FIND IT AND FIX IT!!)
    var normalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexNormals), gl.STATIC_DRAW);
    
    var vertexNormal = gl.getAttribLocation(myShaderProgram,"vertexNormal");
    gl.vertexAttribPointer( vertexNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vertexNormal );
    
    // Set up coefficients for the object
    // (ambient coefficients, diffuse coefficients,
    // specular coefficients, shininess)
    // and send them as uniform variables to the shader program (NEEDS CODE)
    let ka = vec3(.9, .2, .2);
    let kd = vec3(.9, .2, .2);
    let ks = vec3(1.0, 1.0, 1.0);
    let shininess = 5.0;

    gl.uniform3f(gl.getUniformLocation(myShaderProgram, "ka"), ka[0], ka[1], ka[2]);
    gl.uniform3f(gl.getUniformLocation(myShaderProgram, "kd"), kd[0], kd[1], kd[2]);
    gl.uniform3f(gl.getUniformLocation(myShaderProgram, "ks"), ks[0], ks[1], ks[2]);

    gl.uniform1f(gl.getUniformLocation(myShaderProgram, "shininess"), shininess);
    
    // Set up the first light source and send the variables
    // to the shader program (NEEDS CODE, VARIABLES DEPEND ON LIGHT TYPE)
    let p0 = vec3(.0, .0, .0);
    let Ia = vec3(1.0, 1.0, 1.0);
    let Id = vec3(1.0, 1.0, 1.0);
    let Is = vec3(1.0, 1.0, 1.0);

    gl.uniform3f(gl.getUniformLocation(myShaderProgram, "Ia"), Ia[0], Ia[1], Ia[2]);
    gl.uniform3f(gl.getUniformLocation(myShaderProgram, "Id"), Id[0], Id[1], Id[2]);
    gl.uniform3f(gl.getUniformLocation(myShaderProgram, "Is"), Is[0], Is[1], Is[2]);
    gl.uniform3f(gl.getUniformLocation(myShaderProgram, "p0"), p0[0], p0[1], p0[2]);
    
    // Set up the second light source and send the variables
    // to the shader program (NEEDS CODE, VARIABLES DEPEND ON LIGHT TYPE)
    
    // Initialize up on/off flags for the both light sources. These
    // flags should be controlled using buttons
    
    // You will need to have an additional uniform variable for the
    // modelview inverse transpose that gets applied to the vertex normal.
    // Figure out the modelview inverse transpose and send it to the
    // shader program as a uniform (NEEDS CODE)

    let MIT = [
        u[0],
        v[0],
        n[0],
        e[0],
        u[1],
        v[1],
        n[1],
        e[1],
        u[2],
        v[2],
        n[2],
        e[2],
        0.0,
        0.0,
        0.0,
        1.0
    ];

    let modelViewITLocation = gl.getUniformLocation(myShaderProgram, "modelViewIT");
    gl.uniformMatrix4fv(modelViewITLocation, false, MIT);
    
    // render the object
    drawObject();

};

// FOLLOWING CODE SKELETON FOR getFaceNormals() NEEDS TO BE COMPLETED
function getFaceNormals( vertices, indexList, numTriangles ) {
    var faceNormals = [];
    for(let i = 0; i < numTriangles; i++) {
        let p0 = vertices[indexList[3*i]];
        let p1 = vertices[indexList[3*i+1]];
        let p2 = vertices[indexList[3*i+2]];

        let v1 = vec3(p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2])
        let v2 = vec3(p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2])

        let n = cross(v1, v2);
        n = normalize(n);
        faceNormals.push(n);
    }

    // Following line returns the array of face normals
    return faceNormals;
}

// FOLLOWING CODE SKELETON FOR getVertexNormals() NEEDS TO BE COMPLETED
function getVertexNormals( vertices, indexList, faceNormals, numVertices, numTriangles ) {
    var vertexNormals = [];
    for(let j = 0; j < numVertices; j++) {
        let vertexNormal = vec3(.0, .0, .0);
        for(let i = 0; i < numTriangles; i++) {
            if(j == indexList[3*i] || j==indexList[3*i+1] || j==indexList[3*i+2]) {
                vertexNormal[0] += faceNormals[i][0];
                vertexNormal[1] += faceNormals[i][1];
                vertexNormal[2] += faceNormals[i][2];
            }
        }

        // console.log(vertexNormal[0]);
        // console.log(vertexNormal[1]);
        // console.log(vertexNormal[2]);

        if(length(vertexNormal) > 1e-6) {
            vertexNormal = normalize(vertexNormal);
        }
        vertexNormals.push(vertexNormal);
    }
    
    // Following line returns the array of vertex normals
    return vertexNormals;
    
}

function drawObject() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.drawElements( gl.TRIANGLES, 3 * numTriangles, gl.UNSIGNED_SHORT, 0 )
}

// Write a script for changing the perspective / orthographic flag
// using a button here



// Write a script for switching on / off the first light source flag
// using a button here



// Write a script for switching on / off the second light source flag
// using a button here

