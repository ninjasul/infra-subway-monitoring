package nextstep.subway.common.log;

import static net.logstash.logback.argument.StructuredArguments.kv;

import java.util.Arrays;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import nextstep.subway.common.util.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@Aspect
public class LogAspect {
    private final static Logger log = LoggerFactory.getLogger(LogAspect.class);

    @Around("(execution(* nextstep.subway.*.ui.AuthController.*(..)) || "
            + "execution(* nextstep.subway.*.ui.LineController.*(..)) || "
            + "execution(* nextstep.subway.*.ui.MemberController.*(..)))")
    public Object handle(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        Object returnObj = null;
        try {
            returnObj = pjp.proceed(pjp.getArgs());
            writeLog(pjp, returnObj, getHttpServletRequest(), System.currentTimeMillis() - start);
            return returnObj;
        } catch (Throwable t) {
            writeErrorLog(getHttpServletRequest(), t);
            throw t;
        }
    }


    private HttpServletRequest getHttpServletRequest() {
        return ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    }

    private void writeLog(ProceedingJoinPoint pjp, Object returnObj, HttpServletRequest request, long elapsed) {
        log.info("[{}][{}][{}][{}ms]: {} -> {}",
                request.getRemoteHost(),
                request.getMethod(),
                request.getRequestURI(),
                elapsed,
                kv("request", writeRequestLog(pjp)),
                kv("response", StringUtils.toSimplifiedIndentedJson(returnObj))
        );
    }

    private String writeRequestLog(ProceedingJoinPoint pjp) {
        return Arrays.stream(pjp.getArgs())
                .map(StringUtils::toSimplifiedIndentedJson)
                .collect(Collectors.joining("\n"));
    }

    private void writeErrorLog(HttpServletRequest request, Throwable t) {
        log.error(String.format("[%s][%s][%s]: ",
                request.getRemoteHost(),
                request.getMethod(),
                request.getRequestURI()),
                t);
    }
}
