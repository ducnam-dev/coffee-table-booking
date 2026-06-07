package com.coffee.backend.infrastructure.persistence;

import com.coffee.backend.domain.model.*;
import com.coffee.backend.domain.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CoffeeTableRepository coffeeTableRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Users
        if (!userRepository.existsByEmail("admin@pamcoffeetea.com")) {
            User admin = User.builder()
                    .fullName("Quản Trị Pam")
                    .email("admin@pamcoffeetea.com")
                    .password(passwordEncoder.encode("admin"))
                    .phone("0901234567")
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("khachhang@gmail.com")) {
            User customer = User.builder()
                    .fullName("Nguyễn Khách Hàng")
                    .email("khachhang@gmail.com")
                    .password(passwordEncoder.encode("customer"))
                    .phone("0901234567")
                    .role(Role.ROLE_CUSTOMER)
                    .build();
            userRepository.save(customer);
        }

        // Seed Coffee Tables
        if (coffeeTableRepository.count() == 0) {
            CoffeeTable t1 = CoffeeTable.builder()
                    .name("Bàn 1 (Cửa sổ)")
                    .seats(2)
                    .isNearWindow(true)
                    .isOutdoor(false)
                    .hasPowerSocket(true)
                    .status(TableStatus.AVAILABLE)
                    .build();
            CoffeeTable t2 = CoffeeTable.builder()
                    .name("Bàn 2 (Sân vườn)")
                    .seats(4)
                    .isNearWindow(false)
                    .isOutdoor(true)
                    .hasPowerSocket(false)
                    .status(TableStatus.AVAILABLE)
                    .build();
            CoffeeTable t3 = CoffeeTable.builder()
                    .name("Bàn 3 (Phòng lạnh)")
                    .seats(6)
                    .isNearWindow(false)
                    .isOutdoor(false)
                    .hasPowerSocket(true)
                    .status(TableStatus.AVAILABLE)
                    .build();
            CoffeeTable t4 = CoffeeTable.builder()
                    .name("Bàn 4 (Gác lửng)")
                    .seats(2)
                    .isNearWindow(true)
                    .isOutdoor(false)
                    .hasPowerSocket(true)
                    .status(TableStatus.AVAILABLE)
                    .build();
            coffeeTableRepository.saveAll(Arrays.asList(t1, t2, t3, t4));
        }

        // Seed Menu Items
        if (menuItemRepository.count() == 0) {
            // Trà Sữa
            MenuItem ts1 = MenuItem.builder()
                    .name("Trà Sữa Gạo Rang")
                    .description("Trà sữa gạo rang thơm bùi, ngọt ngào đặc trưng.")
                    .price(new BigDecimal("18000"))
                    .imageUrl("./assets/menu-item-1.jpg")
                    .isAvailable(true)
                    .category("Trà Sữa")
                    .build();
            MenuItem ts2 = MenuItem.builder()
                    .name("Trà Sữa Thái")
                    .description("Trà sữa Thái xanh/đỏ thơm mát đậm đà vị trà thảo mộc.")
                    .price(new BigDecimal("15000"))
                    .imageUrl("./assets/menu-item-2.jpg")
                    .isAvailable(true)
                    .category("Trà Sữa")
                    .build();
            MenuItem ts3 = MenuItem.builder()
                    .name("Trà Sữa Môn")
                    .description("Trà sữa khoai môn ngọt bùi, béo ngậy sắc tím.")
                    .price(new BigDecimal("15000"))
                    .imageUrl("./assets/menu-item-3.jpg")
                    .isAvailable(true)
                    .category("Trà Sữa")
                    .build();
            MenuItem ts4 = MenuItem.builder()
                    .name("Trà Sữa Socola")
                    .description("Trà sữa hương vị Socola đậm vị đắng ngọt hòa quyện.")
                    .price(new BigDecimal("15000"))
                    .imageUrl("./assets/menu-item-4.jpg")
                    .isAvailable(true)
                    .category("Trà Sữa")
                    .build();
            MenuItem ts5 = MenuItem.builder()
                    .name("Trà Sữa Truyền Thống")
                    .description("Trà sữa truyền thống thơm ngon đậm vị trà béo vị sữa.")
                    .price(new BigDecimal("15000"))
                    .imageUrl("./assets/menu-item-5.jpg")
                    .isAvailable(true)
                    .category("Trà Sữa")
                    .build();

            // Ca Cao
            MenuItem cc1 = MenuItem.builder()
                    .name("Ca Cao Dầm Trân Châu")
                    .description("Ca cao dầm đậm đặc kèm trân châu dai ngon sần sật.")
                    .price(new BigDecimal("20000"))
                    .imageUrl("./assets/menu-item-6.jpg")
                    .isAvailable(true)
                    .category("Ca Cao")
                    .build();

            // Sữa Tươi
            MenuItem st1 = MenuItem.builder()
                    .name("Sữa Tươi Dâu Tằm")
                    .description("Sữa tươi béo ngậy quyện mứt dâu tằm chua ngọt tự nhiên.")
                    .price(new BigDecimal("20000"))
                    .imageUrl("./assets/menu-item-7.jpg")
                    .isAvailable(true)
                    .category("Sữa Tươi")
                    .build();
            MenuItem st2 = MenuItem.builder()
                    .name("Sữa Tươi Việt Quất")
                    .description("Sữa tươi thơm béo kết hợp sốt việt quất chua ngọt tươi mát.")
                    .price(new BigDecimal("20000"))
                    .imageUrl("./assets/menu-item-8.jpg")
                    .isAvailable(true)
                    .category("Sữa Tươi")
                    .build();
            MenuItem st3 = MenuItem.builder()
                    .name("Sữa Tươi Trân Châu Đường Đen")
                    .description("Sữa tươi trân châu đường đen trứ danh ngọt ngào thơm ngon.")
                    .price(new BigDecimal("20000"))
                    .imageUrl("./assets/menu-item-9.jpg")
                    .isAvailable(true)
                    .category("Sữa Tươi")
                    .build();

            // Trà Trái Cây
            MenuItem tc1 = MenuItem.builder()
                    .name("Trà Đào")
                    .description("Trà đào thơm thanh mát cùng những lát đào giòn ngọt.")
                    .price(new BigDecimal("15000"))
                    .imageUrl("./assets/menu-item-10.jpg")
                    .isAvailable(true)
                    .category("Trà Trái Cây")
                    .build();
            MenuItem tc2 = MenuItem.builder()
                    .name("Trà Tắc")
                    .description("Trà tắc/quất chua chua ngọt ngọt giải nhiệt cực đã.")
                    .price(new BigDecimal("15000"))
                    .imageUrl("./assets/menu-item-11.jpg")
                    .isAvailable(true)
                    .category("Trà Trái Cây")
                    .build();
            MenuItem tc3 = MenuItem.builder()
                    .name("Trà Dâu")
                    .description("Trà dâu tây tươi mát ngập tràn vị dâu ngọt ngào.")
                    .price(new BigDecimal("15000"))
                    .imageUrl("./assets/menu-item-12.jpg")
                    .isAvailable(true)
                    .category("Trà Trái Cây")
                    .build();

            menuItemRepository.saveAll(Arrays.asList(
                    ts1, ts2, ts3, ts4, ts5,
                    cc1,
                    st1, st2, st3,
                    tc1, tc2, tc3
            ));
        }
    }
}
