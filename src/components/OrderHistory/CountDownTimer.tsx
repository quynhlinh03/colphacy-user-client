import { FC, useEffect, useState } from 'react';

interface CountDownTimerProps {
    orderTime: Date;
}

const CountDownTimer: FC<CountDownTimerProps> = ({ orderTime }) => {
    const [countdown, setCountdown] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
    });

    // Get the current date and time
    const current_date = new Date();
    useEffect(() => {
        
        // If orderTime is from the previous day, add 24 hours
        if (orderTime.getDate() < current_date.getDate()) {
            current_date.setHours(current_date.getHours() + 24);
        }

        // Add 3 hours to the order time
        current_date.setHours(current_date.getHours());
        // console.log(current_date);
        // console.log(orderTime);
        const interval = setInterval(() => {
            const seconds_left =3*3600 - (current_date.getTime() - orderTime.getTime()) / 1000;
            
            const days = pad(seconds_left / 86400);
            const hours = pad((seconds_left % 86400) / 3600);
            const minutes = pad((seconds_left % 3600) / 60);
            const seconds = pad(seconds_left % 60);

            setCountdown({
                days,
                hours,
                minutes,
                seconds,
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [orderTime, current_date]);

    function pad(n) {
        return (n < 10 ? '0' : '') + Math.floor(n);
    }

    return (
        <div id="countdown">
            <div id='tiles'>
                <span>{countdown.hours}:</span>
                <span>{countdown.minutes}:</span>
                <span>{countdown.seconds}</span>
            </div>
        </div>
    );
};

export default CountDownTimer;
