import PromptLibrary from './Library'
import Dialog from '../Dialog'
import { ChatData } from '~app/consts'

interface Props {
  isOpen: boolean
  id: number
  onClose: () => void
  chatData: ChatData
  setPrompt: (value: string) => void
}

const InfoDialog = (props: Props) => {
  function getImgPath(id: any) {
    return 'assets\\avatars\\' + id + 'l.png'
  }

  function prompt(txt: string) {
    props.onClose()
    props.setPrompt(txt)
  }

  function isFirstCharHash(str: string): boolean {
    return str.charAt(0) === "#";
  }

  return (
    <Dialog
      title={props.chatData.nom_complet}
      open={props.isOpen}
      onClose={props.onClose}
      className="min-h-[400px] nomPhilosophe grandeBoiteDialog2 titreDialog2"
    >
      <div className="p-5 overflow-hidden boiteDialog rounded-[15px] py-2 text-[#303030] styleInfo grandBoiteInfo">
        <div className="displayFlex fullHeight">
          <div className="moitieHorizontale">
            <img src={getImgPath(props.chatData.id)} className="imgInfo" />
          </div>
          <div className="moitieDroiteInfo moitieVerticale texteInfos2">
            <p dangerouslySetInnerHTML={{ __html: props.chatData.infos }} />
            {(props.chatData.categorie != "Autres") &&
              <div className="displayFlex displayFlex2">
                <div className="moitieHorizontale">
                  <div className="boxPhilosophe group items-center rounded-lg border border-gray-300 bg-white px-5 py-4 shadow-sm fullHorizontale cursorAuto">
                    <b>Les thèmes</b>
                    <div className="flexDiv">
                      {props.chatData.concepts.map((concept) => (
                        <a
                          className="w-full flex flex-col justify-center petitsBoutons"
                          onClick={(event) => {
                            prompt('Quelles sont tes grandes idées sur ' + concept + ' ?')
                          }}
                        >
                          <div className="text-white textePetitBouton font-medium text-sm">{concept}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="moitieHorizontale">
                  <div className="boxPhilosophe group items-center rounded-lg border border-gray-300 bg-white px-5 py-4 shadow-sm fullHorizontale cursorAuto">
                    <b>Les concepts</b>

                    <div className="flexDiv">
                      {props.chatData.concepts_signés.map((concept) => (
                        <>
                          {(!isFirstCharHash(concept.concept)) &&
                            <a
                              className="w-full flex flex-col justify-center petitsBoutons"
                              onClick={(event) => {
                                prompt('Comment conçois-tu ' + concept.concept + ' ?')
                              }}
                            >
                              <div className="text-white textePetitBouton font-medium text-sm">{concept.concept}</div>
                            </a>
                          }</>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default InfoDialog
