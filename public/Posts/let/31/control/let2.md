제어공학 3주차
*^*MET*^*
# 기어가 포함된 System
- 1rad : 반지름의 길이와 호의 길이가 같을때 1 라디안. 
<div style="display:inline-block"></div>

- **회전거리** 는 같다.
$$ r_1 \theta_1 = r_2 \theta_2 $$
$$ {N_1\over{N_2}} $$
$$\therefore \theta_2 = {N_1\over{N_2}} \times \theta{1} $$

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


# 3장.시간 영역에서의 모델링

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