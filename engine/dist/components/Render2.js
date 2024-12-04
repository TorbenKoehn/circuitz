import Component from '../Component.js';
import Transform2 from './Transform2.js';
export default class Render2 extends Component {
    static dependencies = [Transform2];
    visible = true;
    geometry = undefined;
    style = undefined;
    target = undefined;
}
