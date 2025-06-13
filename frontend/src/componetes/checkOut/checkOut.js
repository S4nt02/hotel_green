import { useEffect, useState } from "react"
import { API_URL } from "../../url"

function CheckOut({ idCheckOut }) {
    const [informacoes, setInformacoes] = useState({})
    const [horario, setHorario] = useState("")
    const [desconto, setDesconto] = useState(0)
    const [formaPagamento, setFormaPagamento] = useState("Dinheiro")

    const buscarInformacoes = async () => {
        const buscar = await fetch(`${API_URL}/api/buscarCheckOut`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: idCheckOut })
        })

        const resultado = await buscar.json()

        // Verifica se o resultado é um array
        const dados = Array.isArray(resultado) ? resultado[0] : resultado

        if (typeof dados.consumo === 'string') {
            try {
                const parsed = JSON.parse(dados.consumo)
                dados.consumo = Array.isArray(parsed) ? parsed : []
            } catch {
                dados.consumo = []
            }
        }

        setInformacoes(dados)
    }

    const obterData = () => {
        const data = new Date()
        const dia = String(data.getDate()).padStart(2, '0')
        const mes = String(data.getMonth() + 1).padStart(2, '0')
        const ano = data.getFullYear()
        const horas = String(data.getHours()).padStart(2, '0')
        const minutos = String(data.getMinutes()).padStart(2, '0')

        const dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}`
        setHorario(dataFormatada)
    }

    useEffect(() => {
        buscarInformacoes()
        obterData()
    }, [])

    const agruparConsumo = () => {
        const agrupado = {}

        if (!informacoes.consumo) return agrupado

        informacoes.consumo.forEach(item => {
            const categoria = item.nomeCategoria || 'Outros'
            if (!agrupado[categoria]) agrupado[categoria] = []
            agrupado[categoria].push(item)
        })

        return agrupado
    }

    const calcularTotalConsumo = () => {
        if (!informacoes.consumo) return 0
        return informacoes.consumo.reduce((total, item) => total + (item.quantidade * item.preco), 0)
    }

    const totalConsumo = calcularTotalConsumo()
    const vlDiaria = Number(informacoes.vlDiaria || 0)
    const periodo = Number(informacoes.periodo || 1)
    const subtotal = vlDiaria * periodo + totalConsumo
    const totalFinal = subtotal - desconto

    const consumoPorCategoria = agruparConsumo()

    return (
        <div>
            <div>
                <p>Quarto: {informacoes.quarto}</p>
                <p>Unidade: {informacoes.nomeUnidade}</p>
            </div>
            <div>
                <p>Hospede Principal: {informacoes.nomeHospede}</p>
                <p>Entrada: {informacoes.horarioEntrada}</p>
                <p>Saída: {horario}</p>
            </div>
            <div>
                <p>Período: {informacoes.periodo}</p>
                <p>Valor Diária: R$ {vlDiaria.toFixed(2)}</p>

                <div>
                    <h3>Consumo</h3>
                    {Object.keys(consumoPorCategoria).map(categoria => (
                        <div key={categoria}>
                            <h4>{categoria}</h4>
                            {consumoPorCategoria[categoria].map((item, i) => (
                                <p key={i}>
                                    {item.item} – {item.quantidade} x R$ {item.preco.toFixed(2)} = R$ {(item.quantidade * item.preco).toFixed(2)}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>

                <div>
                    <h3>Sub-Total: R$ {subtotal.toFixed(2)}</h3>

                    <label>Desconto</label>
                    <input
                        type="number"
                        value={desconto}
                        onChange={e => setDesconto(Number(e.target.value))}
                    />

                    <h3>Total com Desconto: R$ {totalFinal.toFixed(2)}</h3>

                    <h3>Forma de pagamento</h3>
                    <select value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)}>
                        <option value="Dinheiro">À vista</option>
                        <option value="Cartão">Faturado</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default CheckOut
