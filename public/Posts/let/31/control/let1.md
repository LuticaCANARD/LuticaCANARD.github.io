제어공학 3주차 수업
*^*MET*^*

# V(s), I(s)의 관계 (임피던스)
- 저항 R<br>
<div style="display:inline-block">
$$ V = I(s) * R $$
</div>
- 인덕터 L<br>
<div style="display:inline-block">
$$ V(s) = I(s) * {Ls}$$
</div>

- 커패시터 C<br>
<div style="display:inline-block">
$$ V(s) = I(s) * {1 \over Cs}$$
</div>

# 회로의 행렬풀이
- Laplace 변환이 이루어진 상태에서

$$ \begin{vmatrix}R_{11} & -R_{12} & -R_{13} \\-R_{21} & R_{22}& -R_{23} \\-R_{31} & -R_{32} & R_{33}\end{vmatrix} \begin{vmatrix} I_1 \\I_2 \\I_3 \end{vmatrix} = \begin{vmatrix} V_1 \\V_2\\V_3\end{vmatrix} $$

> 이를 **CRAMMER's RULE** 를 통해서  
>  I1,I2,I3를 구해낸다. (T/F 구하기.)

# 기계시스템에서의 제어공학
- 늘어나는 거리는 f(t)...
## 스프링
- 계수는 = k
- $$f(t) = kf(t)$$
- 기계적 임피던스는 
<div style="display:inline-block">
$$K$$
</div>

## 댐퍼/제동기 
- 범퍼같은거
- $$f(t) = f_{v} * {dx(t)\over dt}$$
- 기계적 임피던스는 
<div style="display:inline-block">
$$f_vs$$
</div>

## 운동체 
- $$f(t) = M * {d^{2}x(t)\over d^{2}t}$$
기계적 임피던스는 
<div style="display:inline-block">
$$Ms^2$$
</div>

## 기계시스템의 전달함수
$$F(s) = (Ms^{2}+f_{v}s+k)X(s)$$

- f(t) = 거리   
- x(t) = 힘

# EX 2.17
풀이의 핵심
> 운동체에 가해지는 모든 임피던스를 "방향을 맞춰서" 생각한다.   
> 거리와 힘의 관계이다. 전기의 전압,전류관계.   
> M2를 따질때 X1도 따지긴 한다. 감안하자.


# Matrix 사용
- 미지수는 X1, X2이다.
$$AX_1(s) - Bx_2(s) = F(s)$$
$$ \begin{vmatrix} R_{1} & -R_{12} \\ -R_{12} & R_{2}\end{vmatrix}\begin{vmatrix} X_{1}\\X_{2}\end{vmatrix} $$


<div style="display:inline-block">
$$R_{n}$$
</div>
은 물체 n에 걸리는 모든 기계적 임피던스<br>

<div style="display:inline-block">
$$R_{x,y}$$
</div>
은 물체 x,y사이의 임피던스

이후 det를 구하여 값을 구하면 F(s)가 나온다. > 전기적과 비슷함.

# 회전운동
- 각 변위가 바뀐다. (토크가 입력)
$$ \tau(s) = I\theta(s) $$

-  전달함수는
$$ {\theta(s) \over \tau(s)} $$
- 스프링 K<br>
<div style="display:inline-block">
$$ \tau(t) = K\theta(t) (K)$$
</div>

- 댐퍼 D<br>
<div style="display:inline-block">
$$ \tau(t) = D{d\theta(t) \over dt}(Ds)$$
</div>

- 요댐퍼 J <br>
<div style="display:inline-block">
$$ \tau(t) = J{d^2\theta(t) \over d^2t} (Js^2) $$
</div>

## EX 2.19
> 비슷하게 푼다.

## EX 2.20
> 회전체는 물체와 달리 일렬이다.
>
## 숙련예제 2.9
- 임의의 물체로 잡아도 된다.
- 월요일 숙제
