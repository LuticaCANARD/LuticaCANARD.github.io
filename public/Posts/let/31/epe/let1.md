전력공학 / 교류기초
*^*MET*^*
# 2주차 
## 교-직류의 구분
- 교류는 반드시 극이 바뀌어야 한다. 

## 파형의 분류
- 구형파
- 삼각파
- 톱니파
- **정현파** 
> sin, cos로 표현되는 파형 (기본이 되는 파형이다.)  
> 늘리거나 줄이거나 중첩이 가능하다....  
> 극성이 바뀌지 않으면 "맥류"라고 한다.     
>
> 모든 전기는 대부분 교류이다. => 정현파 교류를 다룬다.     
> 발전기가 만드는 전류이기 떄문.

$$ V(s) = sin \Theta $$

- 선속도
> 단위시간당 움직이는 속도.  
> 선에서 이루어진다.

- 각속도
> 시간당 돌아가는 각의 속도.    
> ex. 시간당 30도 ... > 모터나 엔진에서 사용 (RPM > R / M)
> $$ RPM = R/M $$
> 분당 회전수
>

## 주기와 주파수.
$$ f = 1/{Hz} $$

## 빠름과 느림 (진상과 지상)
- 주파수가 같아야 한다. 
- 위상이 느리다 ... 
- -seta는 느리고, -지상 
- +seta가 빠르다. -진상
> <br/>
>   
> $$i1 = \cos(\theta+20)$$
> $$i2 = \cos(\theta-10)$$
>       
> i2는 i1보다 30도 느리다.
## RMS - 실효치
- Root Mean Squre
$$ Im\div\sqrt{2} $$
> 정현파는 상관없이 최댓값 / root(2)만 하면 된다.   
> 정현파가 아니면 적분 
>
## 선형시스템
> 회로는 대부분 선형    
> 
- **비례성 , 중첩성 성립**  
    선형 시스템 f(x)는,     
    두 입력 x1,x2에 대하여, 
    $$f(Ax_{1}+Bx_{2}) = Af(x_{1}) + Bf(x_{2})$$ 
    가 성립 하여야한다.

- **오일러 항등식**
$$e^{j\theta} = \cos{\theta} + j\sin{\theta} $$

- 가상해
> 오일러 변환한 부분중 필요한 부분만 취함...

## Phasor 와 Impedance 

- 임피던스 / 어드미턴스
  $$ Z={1\over Y} $$
- 서세턴스
- 전류<>전압을 물리적으로 연결함. 
- "옴의 법칙"의 확장 

## Phaser, Impedance의 계산과 방법
- 임피던스
> 일반 저항의 계산법과 같다. 병렬저항의 계산법, 직렬 저항의 계산법은 모두 동일하다.     
$$ R_{a} = R_{1}+R_{2} $$

### 복소 임피던스의 계산
- 페이저 접근
$$ {\phase{a}^\circ \over {\phase{b}^\circ}}=\phase{a}-b^\circ $$

- 복소평면 접근
> X축은 실수, Y축은 허수인 복소평면을 생각한다.   
> 페이저 to 복소평면은 각도와 삼각함수로 변환한다.


## Impidence
$$ \Z = R + jX $$

- X : 리액턴스(reactance)

$$ Y = \Z = G + jB $$

- B : 서셉턴스(susceptance)

## 페이저의 계산 정리
- HOW TO TRANSFORM IMAGE NUMBER TO PHASE
$$ \frac{\alpha}{B+jC} => \alpha \phase{\tan^-1{\frac{C}{B}}} $$

- FROM image number TO real >
$$ \alpha \phase{\beta} = \alpha [\text{what}(\omega t+\beta)] $$

# 소자의 종류
- 전력을 구할때, 전력의 방향을 찾을때 사용한다.
$$ P = VI $$

## 수동소자
- 순방향이다. (+ to -)
- 전류의 방향과 일치하다
> 수동소자에서 구한 전력은 **소비된 전력을 의미한다.**

## 능동소자
- 역방향이다. (- to +)
- 만들어내는 Energy 
> 능동소자에서 구한 전력은 **생산된 전력을 의미한다.**

# 삼각함수에 관한 공식들...
$$\sin{\alpha+\beta} =\sin{\alpha}\cos{\beta} + \sin{\beta}\cos{\alpha} $$
$$\cos{\alpha+\beta} =\sin{\alpha}\cos{\beta} - \sin{\beta}\cos{\alpha} $$

# 전력의 구성
## 전력
$$ S = P + jQ $$

- S : 피상전력 (VA)
- P : 유효전력 (실제로 일한다.)
- Q : 무효전력

### 피상전력
$$  $$

### 유효전력
$$ P = \frac{V_mI_m}{2}\cos\theta = \frac{V_m}{\sqrt{2}}\frac{I_m}{\sqrt{2}}\cos\theta = V_{RMS}I_{RMS}\cos\theta$$

- 실수성분이다.
- W(와트)

### 무효전력
$$ Q = \frac{V_mI_m}{2}\sin\theta$$

- VAR 

### 주지해야 할 것.
- 전력의 크기를 무조건! RMS값으로 표기한다.
$$S = VI^\star$$

- 복소저항
- I* => 켤레복소수. (conjugation)
#### 켤레복소수의 페이저표현
$$ \phase{\theta}^\star => \phase{-\theta} $$

# 복소전력...
## 저항 R
$$ RI_{\text{RMS}}^2\phase{0\degree} $$

> 저항 R에서는 유효전력 P만 소모된다.

## 인덕터 L
$$ j \omega L \times (I_{m}\phase{\theta})^2  $$
$$ = \omega L I_{m}^2\phase{90\degree} $$
$$ \therefore \omega L I_{m}^2 $$

> 인덕터 L에서는 유효전력이 0이 소모되고,       
> 무효전력 **L * Im^2**가 소모된다.     
> (전압은 전류보다 90도 앞서간다. 지상부하)

## 커패시터 C
$$ -j\frac{1}{\omega C} \times (I_m\phase{\theta})^2 $$
$$ = \frac{1}{\omega C} I_m^2 \phase{-90\degree}$$
$$ \therefore -\frac{1}{\omega C} (I_m)^2 $$

> 인덕터 L에서는 유효전력이 0이 소모되고,       
> 무효전력 **1/(wc) * Im^2**가 생산된다.    
> (전압은 전류보다 90도 뒤쳐진다. 진상부하)

# 역률
- Power Factor > P.F
- 전류의 위상각과 전압의 위상각의 차이. 
- **전류가** 전압보다 앞서면(위상의 delta가 크면) "**진상**역률", 전류가 전압보다 뒤지면 "**지상**역률"이라고 한다.
- 진상부하 / 지상부하.
$$P.F = \cos(PFD)$$

