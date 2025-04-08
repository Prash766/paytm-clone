import { Button } from "@repo/ui/ui"
const FormButton = ({children , className , type="button"}:{children :React.ReactNode , className?:string , type : "button"| "reset" | "submit"}) => {
  return (
    <Button type={type} className={className}>
        {children}
    </Button>
    
  )
}

export default FormButton