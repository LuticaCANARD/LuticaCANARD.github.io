제어공학 5주차
*^*MET*^*
# Canonical Form
$$ \begin{matrix} \frac{dx_1}{dt}\\\frac{dx_2}{dt}\\\frac{dx_3}{dt} \end{matrix} = \begin{matrix}0&1&0\\0&0&1\\-9&-6&-3\end{matrix}\begin{matrix}x_1\\x_2\\x_3\end{matrix}+\begin{matrix}0\\0\\+7\end{matrix}u(t) $$
- ON ... state variable.
$$ x_1 = y(t) , x_2=y`(t)...$$
- 분자가 있다면 C매트릭스가 바뀐다.

$$Y(s) = AX`(s) + BU(s) \\ Y(s) = CX (s) + DV(s)$$ 
$$T.F = C(sIA^{-1}B + D)$$
# Block Diagram
- Kalman에 의해 정립 어쩌구
- 제어에 선형대수를 도입해서 어쩌구
- 입력 > system > 출력 
## 블록선도 5.2
- 주파수 영역의 그림화
- Block Diagram Algebra 로 단순화 
1. Block : system (TF).. 곱하기
2. Arrow(Line) : signal
3. Summing Junction : 계산 > 원형으로 되어있음.
4. Pickoff Point : R(s)가 모든 포인트로 동일하게 나감. 

### Cascade (종속형)
- G1 G2 G3가 LINE로 되어있는데, 이를 줄이고 싶음.
- 입력은 U(s)
- U(s) * G1 * G2 * G3 로 줄일 수 있다.
### Parallel(병렬)
- G1, G2, G3가 모두 병렬이고, 최후에는 더할 때.
- U(s)가 입력될 떄...
- U(s) * (G1+G2+G3) 으로 줄일 수 있다. 
### Feedback (피드백)
- G(s) , H(s)
- R(s)가 입력, C(s)가 출력
- E(s)를 중간 입력이라 하자...
- E(s) = R(s) - H(s)C(s)
- C(s) = G(s)E(s)
- C(s) = G(s)R(s)-G(s)H(s)C(s)
- (1+G(s)H(s))*C(s) = G(s)R(s)
- 따라서...
$$  \frac{C(s)}{R(s)}= \frac{G(s)}{(1+G(s)H(s))} $$
> 대부분 빼기긴 한데, 더하기인 경우가 있기는 하다.  
> 따라서, 부호도 알아는 두자... 그 경우 +가 -가 된다.

### Block Diagram Algebra
- 단순화에 쓰인다.
1. case1 :
- G(R-X)를 단순화.. > GR-GX가 가능하다.
2. case2 :
- RG-X .... > G(R-X/G)로 변형이 된다.
3. case3 :
- R(s) -> pickoff -> G1(s)
- 다른곳에 1/G1(s) 를 삽입.
4. case4 :
- pickoff 분배가 가능하다.

## Signal flow 신호흐름 선도
- 시간영역의 그림화
- Moson's role로 단순화
### 구성요소
- Line : T/F
- Node : Signal
> Summing Junction, Pickoff는 없다.     
->- : line 
0 : node
### Transform From Block Diagram

# Mason's rule
- (그림 5.20)

## loop gate
- loop
- 돌아오는 것이 loop gate
- G2H1 , G4H2, 
## Forward Path Gate
- 경로
- 123457
- 123467

## non-touching loop gate
- 안만나는 게이트(두 게이트가 안만나는 경우)

## T/F 
1 - loop gain의 합
G(s) = c/r = Forward합/1-Loop합+(non-touching Loop)-3중루프.....
- 교집합 구하기!

R->(T.F)->C

# SSD. To SFG

$$x_1` = 2x_1 -5x_2 +2r \\ x_2` = -6x_1 -2x_2 +5r \\ y = -4x_1 + 6x_2 $$

- 정리하고 풀기

# 상태공간의 다른표현
- Phase Variable Canonical Form

- Cascade Form
> 선도 그리고 라플라스 역변환으로 original Form으로 변환    
> 각자나온걸 잡았다.    

- Parallel
> 부분분수로 나누고 블록선도 +로.   
> 상태변수를 1차 결과로 잡는다.     

- Controller canonical Form
> 변수 행렬속 순서가 역순이다!

- observer canonical Form
> phase canonical From으로부터 역행렬을 취하여 쉽게 얻을 수 있다.

# 5.8 유사변환
$$ \frac{dx}{dt} = AX+BU\\Y=CX+DU (X=PZ) \\ P\frac{dz}{dt} = ApZ + BU\\Y=CPZ+DU\\\frac{dz}{dt} = P^{-1}APZ + P^{-1}BU\\Y=CPZ=PU $$
이를...
$$A`=P^{-1}AP\\B`=P^{-1}B\\ C`=CP\\D`=D$$

A\`를 dingonal matrix로 만들기 위해, P를 A의 고유벡터로 선정하면, A\`P-1AP응 diagonal이 된다.

* 고유벡터 :
$$A=x_i = \lambda_ix_i$$
* 고유치 :
$$ (A - \lambda_iI) x_i = 0 $$

# 1차 system

## 시정수 time constant. T
- at = 1인 t값

## 상승시간 Rise Time. Tr
-  응답이 0.1~0.9까지 도달하는데 걸리는 시간

## 정착시간 Settling Time. Ts
- 응답이 final value의 +- 2%에 머무는데 걸리는 시간

# 2차 시스템 개요
- 식의 형태에 따라서 pole의 갯수가 달라진다.
- (둘 다 실수/둘 다 복소수/ 둘 다 숭허수 / 둘 다 실수 중근)

## 둘 다 실수인 경우
- 과감쇠 over-damped
- L>1

## 둘 다 복소수
- 미흡감쇠 under-damped
- 0< L <1

## 둘 다 순허수
- 무감쇠 un-damped
- L=0
## 둘이 실수 중근 
- 임계감쇠 critically damped
- L=1
## 2차시스템의 구성

$$\frac{w_n^2}{s^2+2Lw_nS+w_n^2}$$
* L = 감쇠비 (damping ratio)