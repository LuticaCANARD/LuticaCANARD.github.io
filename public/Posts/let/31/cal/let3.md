
*^*MET*^*
# 리틀앤디안/빅앤디안
- 빅앤디안이 자연스럽다.
- 빅앤디안이 정순서
- 리틀앤디안이 역순


# CISC RISC
## CISC
- 복합명령어. 더 넓게.

## RISC
- 더 적은걸 더 빠르게.

## 시멘트 갭
> 고급언어와 저급언어 사이의 갭     
> 줄어들었다.

## 2의 보수
- 해석 : -1, 반전<맨 앞이 1일때>, 해석(- 붙임...)

## 0확장/부호확장
- 0확장 : 0만 붙임 > unsigned
- 부호확장 : 1만 붙임.

# 유부호 표기법
- 1의 보수
> 반전
- 2의 보수
> 반전후 +1
- 초과수
> 모든수에 특정수를 더한다.

# 실수
## 과학적 표기법
- 맨 앞이 0이 아닌수로 시작...
- 2*10^-3 같은거.
- 소수점 왼쪽은 "단 한자리"

## 그 적용
- <부호비트>
- <지수필드> 
- <가수필드>
$$EX: +6.13^(-3) = 0.00613 => 0 [-3] [613] $$
- 정규화로 고정할 필요가 있다.
- 맨 앞의 1.은 생략가능하다.> 가수필드! (2진법만=잠복비트)
- 잠복비트의 문제> 0은 표기불가하다.

### IEEE - 754 실수표기법
- float 4 / double 8
- 잠복비트 사용(1. 제외하고 가수 표현)
- 부호-지수(127초과수)-가수 field순
> LIKE : + 1.0001   
> +=> 0(+) 1000100(5 ex127) 0001...(가수만 총 23개)     
> 총 32개. 4byte
- 변환시 2의 지승이라는것에 유의하자!
- 2진수로 바꿔야 변환가능하다.<제약>
- TIP: 소수점 이하를 구하는건지 뭘 구하는건지 확실히 하자.