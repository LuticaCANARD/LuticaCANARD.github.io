4장 요약
*^*MET*^*
# Cascade 
- 차수별로 신호흐름 나눔.
# Paraell
- 부분분수 전개
# Phase Variable Canonical Form
- 계수들을 맨 아레에 두고... 바꾸기.
# Controller canonical Form 
- Phase의 반대
# observer canonical Form
- 전개 후 S최대차수로 모두 나누기.

# 4장

- 시스템의 고유응답 : pole
- 강제응답 : 입력때문에 생김

$$\frac{a}{s+b}$$

- t = 1/a
- rising time : 10% to 90%
- settleing time : +-2%

## DECLERE
- POLE / 극 : 분모를 0으로 만드는 값.
- 과감쇄 : pole들이 실수 zeta > 1
- 미흡감쇄 : pole들이 순허수 1>zeta>0
- 임계감쇄 : pole가 중근( zeta == 0 )
- 무감쇄 : 순허수 (sqrt(last))
- zeta : 감쇄비 (damping ratio)

## 복소평면...
- Y=> 허수
- X=> 실수
$$x^2+y^2=r^2$$
- 원의 공식..
- $$\zeta^2\omega_n^2+- j(\omega_n\sqrt{1-\zeta^2})$$

- 따라서, 제타가 0, 0-1, 1에 따라서 순허수,실수,허수가 나뉜다.
- $$\cos\theta = \frac{\zeta}{\omega_n}=\zeta !$$
 
- FROM 복소평면.

## Case 3 복소수
  $$F(s) = \frac{5}{s(s^2+2s+5)}$$
  - 라플라스 역변환을 취한다.
  
  $$\frac{k_1}{s}+\frac{k_2s+k_3}{s^2+2s+5}$$
  $$e^{-at}\cos\theta => \frac{(s+a)}{(s+a)^2+\omega^2}$$
  $$\sin\theta =>  \frac{(s+a)}{(s+a)^2\omega^2}$$
* 차수 맞춰줘야함!
$$\cos(a - b) = \cos a \cos b + \sin a \sin b$$
- F(s)를 f(t)로 바꾸는 문제
$$e^{-t}\sqrt{\frac{5}{4}}(\cos(2t-\pi))$$
- 단, arctan pi== 1/2
- Case 3
- 미흡감쇄 :
- 
$$C(s) = \frac{w_n^2}{s^2+syw_nS+w_n^2}\times\frac{1}{s} = \frac{k_1}{s}+\frac{k_2s+k_3}{s^2+2yw_ns+w_n^2}\\-\frac{S+2\Zeta\omega_n}{S^2+2Ys+\omega_n} \\= -(\frac{s+\zeta\omega_n}{(s+L\omega_n)^2+\omega_n(1-\zeta^2)}+\frac{\zeta\omega_n}{(s+L\omega_n)^2+\omega_n(1-\zeta^2)})\\C(t) = u(t) - (e^(-\zeta\omega t)\times\cos(\omega_n\sqrt{1-\zeta^2})\times(\frac{\zeta}{\sqrt{1-\zeta^2}})) \\= \frac{\zeta}{\sqrt{1-\zeta^2}}\times e^{-\zeta\omega_n t}\sin({\omega_n\sqrt{1-\zeta^2}\times t})\\c(t) = 1-e^{\zeta\omega_n t}(\cos(\omega_n\sqrt{1-\zeta}\times t)+\frac{\zeta}{\sqrt{1-\zeta^2}}\sin(\omega_n\sqrt{1-\zeta^2} t))$$

> 복소평면으로 나타내서 cos를 x,    
> sin를 y로 ... 이걸 붙인다. 