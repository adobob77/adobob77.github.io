float smooth = 0.008;//smaller values make smoother images, default 0.008
int gridSize = 5;//controlled area size of a single vector, in pixels
Vector[] vList;//list that will hold a vectormap
boolean genFlow = false;
float x = random(1,width-1);
float y = random(1, height-1);
float xspeed = 0;
float yspeed = 0;

//vector object
public class Vector{
  //variables
  private float xCor;
  private float yCor;
  private float size;
  private float dir;
  //constructor
  public Vector(float x, float y, float s){
    xCor = x;
    yCor = y;
    size = s;
    dir = 0;
  }
  //getter functions
  public float getX(){
    return xCor;
  }
  public float getY(){
    return yCor;
  }
  public float getSize(){
    return size;
  }
  public float getDir(){
    return dir;
  }
  //draw function
  public void makeVector(){
    smooth=0.001;
    dir =  noise(smooth*(xCor*size),smooth*(yCor*size))*(float)Math.PI*2;
    float x2 = cos(dir)*0.9+xCor;
    float y2 = sin(dir)*0.9+yCor;
    line(xCor*gridSize+size-1,yCor*gridSize+size-1,x2*gridSize+size-1,y2*gridSize+size-1);
  }
}

void setup(){//setup functions, runs at startup
  size(1300,900);
  frameRate(10000);
  colorMode(RGB,1.0);
  background(0);
  noSmooth();
  noiseDetail(10);
  vList = new Vector[(width/gridSize)*(height/gridSize)];
  println("Press 1 for grey, 2 for rgb, 3 for vectormap, 4 for flowmap, 5 for procedurally drawn flowmap, 0 to clear the background");
}

void draw(){
   if(genFlow){
     for(int i=0;i<50;i++){
       if(x>0&&x<width&&y>0&&y<height){
         int nearx = (int)(x/gridSize);
         int neary = (int)(y/gridSize);
         xspeed+=cos(vList[nearx*neary].getDir())*(gridSize*0.8);
         yspeed+=sin(vList[nearx*neary].getDir())*(gridSize*0.8);
         float nextx = x+xspeed;
         float nexty = y+yspeed;
         stroke(1,0.1);
         line(x,y,nextx,nexty);
         x=nextx;
         y=nexty;
       }
       else if(x<0||x>width){
         x=random(1,width-1);
         y=random(1,height-1);
         xspeed=0;
         yspeed=0;
       }
       else if(y<0||y>height){
         x=random(1,width-1);
         y=random(1,height-1);
         xspeed=0;
         yspeed=0;
       }
     }
   }
}

void vectors(){//creates vectormap
  background(0);
  stroke(1,0.5);
  print("Generating vectormap... ");
  int x=0;
  int y=0;
  for(x=0;x<width/gridSize;x++){
     for(y=0;y<height/gridSize;y++){
        vList[x*y] = new Vector(x,y,gridSize);
        vList[x*y].makeVector();
     }
  }
  println("Done!");
}

int checkVectMap(){
  try{
    vList[0].getSize();
  }catch(Exception e){
    return 0;//if no vectormap exists, return 0
  }
  return 1;
}

int flowMap(){//creates flowmap
  background(0);
  stroke(1,0.1);
  try{
    vList[0].getSize();
  }catch(Exception e){
    return 0;//if no vectormap exists, return 0
  }
  print("Generating flowmap... ");
  //build code
  for(int step=0;step<height;step+=gridSize*3){
    for(float xstep=0;xstep<width;xstep+=gridSize*3){
      float x=xstep;
      float y=step;
      float xspeed=0;
      float yspeed=0;
      float nextx=0;
      float nexty=0;
      int i=0;
      while(i<10000&&(x<width&&x>0)&&(y<height&&y>0)){
        int nearx = (int)(x/gridSize);
        int neary = (int)(y/gridSize);
        if(nearx<0||nearx>=width/gridSize||neary<0||neary>=height/gridSize){
          break;
        }
        xspeed+=cos(vList[nearx*neary].getDir())*(gridSize*0.8);
        yspeed+=sin(vList[nearx*neary].getDir())*(gridSize*0.8);
        nextx=x+xspeed;
        nexty=y+yspeed;
        line(x,y,nextx,nexty);
        x=nextx;
        y=nexty;
        i++;
      }
    }
  }
  return 1;//if successful, return 1
}

void keyTyped(){
  int seed=0;
  while(seed==0){
    seed = (int)pow((float)Math.random()*10,5);
  }
  noiseSeed(seed);
  smooth=0.008;
  float val=0;
  if(key=='2'){//rgb
    print("Seed: "+seed+"\nGenerating...");
    for(int x=0;x<width;x++){
       for(int y=0;y<height;y++){
         val = pow(noise(smooth*x,smooth*y)*10,6.4);
         stroke(-(int)val);
         point(x,y);
       }
    }
    println(" Done!");
  }else if(key=='1'){//grey
    print("Seed: "+seed+"\nGenerating...");
    for(int x=0;x<width;x++){
       for(int y=0;y<height;y++){
         val = noise(smooth*x,smooth*y);
         stroke(val);
         point(x,y);
       }
    }
    println(" Done!");
  }else if(key=='3'){//lines
    vectors();
  }else if(key=='4'){//curvy lines
    if(flowMap()==0){
       println("REQUIRES BUILT VECTORMAP"); 
    }else{
      println("Done!");
    }
  }else if(key=='5'){
    if(checkVectMap()==0){
      println("REQUIRES BUILT VECTORMAP"); 
    }else{
      if(genFlow){
        genFlow=false;
        println("No longer tracing particles");
      }else{
        genFlow=true;
        println("Now tracing particles");
      }
    }
  }else if(key=='0'){
    background(0);
    println("Background cleared");
  }else{
    genFlow = false;
    setup();
  }
}
