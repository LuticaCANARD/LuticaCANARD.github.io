제어공학 3주차
*^*MET*^*
# 기어가 포함된 System
- 1rad : 반지름의 길이와 호의 길이가 같을때 1 라디안. 
<div style="display:inline-block"></div>

- **회전거리** 는 같다.
$$ r_1 \theta_1 = r_2 \theta_2 $$
$$ {N_1\over{N_2}} $$
$$\therefore \theta_2 = {N_1\over{N_2}} \times \theta_1 $$

- **회전운동에너지** 는 같다.
 $$ \tau_1 \times \theta_1 = \tau_2 \times \theta_2 $$
 $$ {\tau_2 \over{\tau_1}} = {\theta_2 \over{\theta_1}} = {N_1\over{N_2}} $$
 $$ \therefore T_2 = ({N_2\over{N_1}} \times T_1)$$

 - **T/F ...** 
$$ {\theta_2(s) \over {T_1(s)}} $$
이런식
## 예제 2.21
- 기어비를 통해서 **바꾸는 과정**이 핵심이다!
- 임피던스의 변환이 목적!

> idx96 2.21 풀어오기 (DESC)

# 기어system 에서의 기계적 임피던스
$$ ({전달측의 톱니수(받는다. 합병측) \over{피전달측의 톱니수(보낸다. 자기측)}})^2 $$
를 곱해서 구할 수 있다.

> HWS: 실력향상 예제 2.1 ~ 2.8 ecampus (일요일까지) 3.26


# 3장. 시간 영역에서의 모델링

## 3장에서의 System 표현... 
- State-Space description으로 표현한다.

## 상태변수
- u(t) -> system -> y(t)
- state variable : **상태변수 x(t)**

## System의 표현
$$\frac{dx(t)}{dt} = Ax(t) + Bu(t)$$
$$y(t) = Cx(t) + Du(t) $$

- 1차 미분방정식은 안풀고, A,B,C,D만 구한다.
- 위의 식을 상태방정식(state eq)이라고 한다.
- 아래 식을 출력방정식(output eq)이라고 한다.

## 3.2 개념정립
- VRL회로에서, 
- 입력이 **V(t)**, 출력이 **Vr(t)**, 상태가 **i(t)**라면
$$ \frac{di(t)}{dt} = [-\frac{R}{L}]i(t) + [\frac{1}{L}] V(t) $$
$$ V_R(t) = [R]i(t) + [0]V(t)$$
- KVL... 만들어서 풀어보자.
- 라플라스 변환 안하고, time domain에서 끝내버린다.


- VRLC회로에서,
- 2차미분 방정식이므로, 상태변수는 2개가 잡힌다.
$$ \begin{bmatrix} \frac{di(t)}{dt} \\ \frac{dv_c(t)}{dt} \end{bmatrix} = \begin{bmatrix} -\frac{R}{L}& -\frac{1}{L} \\ \frac{1}{c} & 0 \end{bmatrix}  \begin{bmatrix} i(t) \\ v_c(t) \end{bmatrix} + \begin{bmatrix}  \frac{1}{L}& 0 \end{bmatrix}  V(t) $$
$$q(t) = \begin{bmatrix} 0 & C \end{bmatrix} \begin{bmatrix} i(t) \\ v_c(t) \end{bmatrix} + \begin{bmatrix} 0 \end{bmatrix}V(t)$$
- 좌변을 우변의 미지수에 의한 방정식으로 표현한다... 선형대수의 기본을 참고하자.
- figure 3.2 참고하여 풀어오자.
- Var이 많아지면 어려워진다.

* 참고
$$i(t) = \frac{dq(t)}{dt}$$

## 같은 예제, 다른 상태변수
- 상태변수 X =
$$ X = \begin{bmatrix} q(t) \\ i(t) \end{bmatrix}$$

일 떄의 

$$ \begin{bmatrix} \frac{dq(t)}{dt} \\ \frac{di(t)}{dt} \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ -\frac{1}{LC}& -\frac{R}{C} \end{bmatrix}  \begin{bmatrix} q(t) \\ i(t) \end{bmatrix} + \begin{bmatrix} 0 & \frac{1}{L} \end{bmatrix}  V(t) $$
$$q(t) = \begin{bmatrix} 1 & 0 \end{bmatrix} \begin{bmatrix} q(t) \\ i(t)  \end{bmatrix} + \begin{bmatrix} 0 \end{bmatrix}V(t)$$

...
* 참고
$$V = V_R + V_L + V_C $$

> State Varible을 어떻게 잡느냐에 따라서 그 값이 달라질 수 있다!    
> System을 표현하는 방법이 여러가지이다.    
> 다만, T/F는 한개이다!     


- 만약 X = V_r,V_c 라면...  

> 상태방정식의 미분형 = 상태변수와 입력 u(t)로 나타낸다.     

$$Ls,{1\over{Cs}},R (V = IR, s = \frac{d}{dt})$$
은 알아두자.