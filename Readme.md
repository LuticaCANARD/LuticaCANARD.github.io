# LuticaCANARD.github.io

A accict of depress   

(index.html)개발 방향 : 
    1. script에서 loadfunction을 통하여 값을 바꿈
    2. html을 list형식으로 만들어 이를 하나씩 불러오는 function을 정의할것.
    3. body onload를 통하여 1차 load를 하고, 이후 버튼을 누르면 onclick을 통하여 갱신하는 형태

(readside.html) 개발 방향 :
    1. script에서 전역함수로 index > readside 로 읽을 html 파일변수(=루트+파일명.html)를 전달
    2. body에서 onload를 통하여 function을 호출하여 html을 불러옴 (id='post')
    3. 게시글 변경시 onclick을 통하여 function을 보냄. 끝.
