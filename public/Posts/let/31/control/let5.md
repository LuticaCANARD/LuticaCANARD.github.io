수업 끝 : Ch.09


# 6장  : stabliity (안정도)
6.1. 개요 
- 전체응답 = 고정응답POLE + 강제응답input
## 고유응답... : (t->inf)
- 시간이 무한대로 갈 떄 고유응답이 0으로 가면 안정하다.
$$ 1+e^(\cos) = 0 $$
- 무한대로 가면 불안정하다. 
- marginally state : 임계안정. 고유응답이 진동 혹은 상수로 수렴

## 전체응답 관점...
- stable   :
>  모든 input -> bounded output 
- unstable :
> 특정 input -> unbounded output인 경우
- bounded output : 끝이 있는 한계가 있는 결과
> marginally state: unstable.... 공명주파수때문
- 고유응답만 따진다.

$$C(s) = \frac{(s+z_1)(s+z_2)}{(s+P_1)(s+P_2)(s+P_3)}\frac{1}{s}\\\frac{k_1}{s+P_1}+\frac{k_2}{s+P_2}+\frac{k_3}{s+P_3}+\frac{1}{s}\\\text{inverse Laplace tranceform}... +1$$
- pole들이 모두 Left-half하다면 .. 수렴
- 단 하나라도 오른쪽에 있다면... 발산...(e^+x)..
- pole의 위치로 안정도를 찾을 수 있다...
- 하나라도 있으면 +텀을 따른다....!!!


# POLE의 위치 찾기
## Routh Hoults 
- S4 a4 a2 a0
- S3 a3 a1 1
- S2 (-det(a4 a2 a3 a1)/a3) (-det(a4 a0 a3 0)/a3 ) (-det(a4 a3 0 0 )/a3) = 0
- S1 (-det(a3 a1 b1 b2)/b1) (-det(a3 a1 0 0)/b1) (-det(a3 a1 0 0)/b1)