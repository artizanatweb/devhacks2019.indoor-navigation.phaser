import FloorPlan from './app/FloorPlan';
import './scss/main.scss';

let container;
let app;
let planTrigger;

window.onload = () => {
    container = document.getElementById('floorPlan');
    app = new FloorPlan(container);
    if (document.getElementById('floorPlanTrigger')) {
        planTrigger = document.getElementById('floorPlanTrigger');
        planTrigger.addEventListener('click', () => {
            console.log(`Show floor plan!`);
            planTrigger.classList.add('show');
            app.emitter.emit('app', 'start');
        });

        app.emitter.on('app', (action) => {
            if (!('close' === action)) {
                return;
            }

            planTrigger.classList.remove('show');
        });
    }
};
