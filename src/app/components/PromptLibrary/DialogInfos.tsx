import PromptLibrary from './Library'
import Dialog from '../Dialog'
import { ChatData } from '~app/consts'

interface Props {
  isOpen: boolean
  id: number
  onClose: () => void
  chatData: ChatData
}

const InfoDialog = (props: Props) => {
  function getImgPath(id: any) {
    return 'assets\\avatars\\' + id + 'l.png'
  }
  return (
    <Dialog
      title={props.chatData.nom_complet}
      open={props.isOpen}
      onClose={props.onClose}
      className="min-h-[400px] nomPhilosophe"
    >
      <div className="p-5 overflow-hidden boiteDialog rounded-[15px] px-4 py-2 text-[#303030] styleInfo">
        <div className="displayFlex fullHeight">
          <div className="moitieHorizontale">
            <img src={getImgPath(props.chatData.id)} className="imgInfo" />
          </div>
          <div className="moitieDroiteInfo moitieVerticale texteInfos">
            <p>
              <b>Emmanuel Kant</b> est considéré comme <b>l’un des penseurs les plus influents</b> de l’histoire de la
              philosophie occidentale. Il a largement influencé la philosophie et la pensée critique grâce à son œuvre
              colossale. Il aborde la question de la <b>science moderne</b> dans sa <i>Critique de la raison pure</i>,
              celle de la <b>morale</b> dans sa <i>Critique de la raison pratique</i>. L'<b>art</b> et le <b>vivant</b>{' '}
              sont abordés dans sa <i>Critique de la faculté de juger</i>.
            </p>
            <div className="displayFlex moitieVerticale">
              <div className="moitieHorizontale">
                <div className="containerPhilosophes boxPhilosophe group items-center rounded-lg border border-gray-300 bg-white px-5 py-4 shadow-sm fullHorizontale cursorAuto">
                  <b>Mes thèmes</b>
                  <div className="flexDiv">
                  {props.chatData.concepts.map((concept) => (
                    <a className="w-full flex flex-col justify-center petitsBoutons">
                      <div className="text-white textePetitBouton font-medium text-sm">{concept}</div>
                    </a>
                  ))}
                  </div>
                </div>
              </div>
              <div className="moitieHorizontale">
              <div className="containerPhilosophes boxPhilosophe group items-center rounded-lg border border-gray-300 bg-white px-5 py-4 shadow-sm fullHorizontale cursorAuto">
                  
                <b>Mes concepts</b>
                 
                <div className="flexDiv">
                {props.chatData.concepts_signés.map((concept) => (
                                     
                                     <a className="w-full flex flex-col justify-center petitsBoutons">
                      <div className="text-white textePetitBouton font-medium text-sm">{concept.concept}</div>
                    </a>
                  ))}
                  </div>



                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default InfoDialog
